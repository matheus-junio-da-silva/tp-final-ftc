// Imprime formato de uma regra de transição
function imprimeFormato() {
    const formato = "Formato: {estado} -> {estado_destino} | {ingrediente} [, {topo-pilha} / {empilha}]";
    console.log(formato);
    return formato;
}

// Lê uma receita de um conteúdo de arquivo dado um alfabeto que deve ser reconhecido
function carregaReceita(conteudoArq, sigma, nomeArq = "receita") {
    const linhas = conteudoArq.trim().split('\n').map(linha => linha.trim()).filter(linha => linha);
    let indiceLinha = 0;

    // Leitura dos estados da máquina
    if (indiceLinha >= linhas.length || !linhas[indiceLinha].startsWith("Q:")) {
        const erro = `> leitura: [!] Em ${nomeArq}: primeira linha deve especificar os estados\nFormato: 'Q:' seguido pela lista de estados, separados por espaços`;
        console.error(erro);
        return null;
    }
    const estados = linhas[indiceLinha].substring(2).trim().split(/\s+/).filter(e => e);
    indiceLinha++;

    // Leitura do estado inicial da máquina
    if (indiceLinha >= linhas.length || !linhas[indiceLinha].startsWith("I:")) {
        const erro = `> leitura: [!] Em ${nomeArq}: segunda linha deve especificar o estado inicial\nFormato 'I:' seguido do nome do estado inicial`;
        console.error(erro);
        return null;
    }
    const estadoInicial = linhas[indiceLinha].substring(2).trim();
    if (!estados.includes(estadoInicial)) {
        const erro = `> leitura: [!] Em ${nomeArq}: estado inicial desconhecido`;
        console.error(erro);
        return null;
    }
    indiceLinha++;

    // Leitura dos estados finais da máquina
    if (indiceLinha >= linhas.length || !linhas[indiceLinha].startsWith("F:")) {
        const erro = `> leitura: [!] Em ${nomeArq}: terceira linha deve especificar os estado finais\nFormato 'F:' seguido pela lista de estados finais, separados por espaços`;
        console.error(erro);
        return null;
    }
    const estadosFinais = linhas[indiceLinha].substring(2).trim().split(/\s+/).filter(e => e);
    for (const estadoFinal of estadosFinais) {
        if (!estados.includes(estadoFinal)) {
            const erro = `[!] Em ${nomeArq}: estado final ${estadoFinal} desconhecido`;
            console.error(erro);
            return null;
        }
    }
    indiceLinha++;

    let numLinha = 3;
    const receita = new Receita(estados, estadoInicial, estadosFinais);
    
    // Leitura das transições
    while (indiceLinha < linhas.length) {
        numLinha++;
        const linha = linhas[indiceLinha];
        if (linha === "---" || !linha) {
            break;
        }
        try {
            processaRegra(nomeArq, sigma, receita, linha, numLinha);
        } catch (error) {
            console.error(`Erro ao processar linha ${numLinha}: ${error.message}`);
            if (error instanceof ErroTransicao) {
                return null;
            }
        }
        indiceLinha++;
    }
    
    return receita;
}

// Processa uma regra
function processaRegra(nomeArq, sigma, receita, linha, numLinha) {
    let ok = true;
    
    // Divisão da transição entre estado de partida e restante
    const trans = linha.split("->");
    if (trans.length !== 2) {
        const erro = `[!] Transição inválida: ${linha}`;
        console.error(erro);
        console.error(imprimeFormato());
        throw new Error(erro);
    }

    // Validação do estado de partida
    const estadoPartida = trans[0].trim();
    if (!(estadoPartida in receita.estados)) {
        const erro = `[!] Em ${nomeArq}, linha ${numLinha}: estado ${estadoPartida} desconhecido`;
        console.error(erro);
        throw new Error(erro);
    }

    // Divisão do restante em estado de destino e restante
    const saida = trans[1].split("|");
    if (saida.length !== 2) {
        const erro = `[!] Transição inválida: ${linha}`;
        console.error(erro);
        console.error(imprimeFormato());
        throw new Error(erro);
    }

    // Validação do estado de destino
    const estadoDestino = saida[0].trim();
    if (!(estadoDestino in receita.estados)) {
        const erro = `[!] Em ${nomeArq}, linha ${numLinha}: estado ${estadoDestino} desconhecido`;
        console.error(erro);
        ok = false;
    }

    // O restante é simplesmente um ingrediente (AFD) ou uma descrição mais
    // complexa que inclui entrada e saída (APD)
    const entradaParts = saida[1].trim().split(',');
    let ingrediente, desempilha = null, empilha = null;
    
    if (entradaParts.length === 1) {
        // Transição de AFD: é só um ingrediente
        ingrediente = entradaParts[0].trim();
    } else if (entradaParts.length === 2) {
        // Deveria ser uma transição de APD:
        // ingrediente, desempilha / empilha
        ingrediente = entradaParts[0].trim();
        const pilhaParts = entradaParts[1].split('/');
        
        if (pilhaParts.length !== 2) {
            const erro = `[!] Em ${nomeArq}, linha ${numLinha}: transição de AP sem propriedade a ser empilhada. Caso deseje que nenhuma propriedade seja empilhada, use o símbolo '_'`;
            console.error(erro);
            console.error(imprimeFormato());
            throw new Error(erro);
        }

        // Valida reação a ser desempilhada
        desempilha = pilhaParts[0].trim();
        if (!sigma.validaReacao(desempilha)) {
            const erro = `[!] Em ${nomeArq}, linha ${numLinha}: reação ${desempilha} não reconhecida`;
            console.error(erro);
            throw new Error(erro);
        }

        // Valida reação a ser empilhada
        empilha = pilhaParts[1].trim();
        if (!sigma.validaReacao(empilha)) {
            const erro = `[!] Em ${nomeArq}, linha ${numLinha}: reação ${empilha} não reconhecida`;
            console.error(erro);
            throw new Error(erro);
        }
    } else {
        const erro = `[!] Em ${nomeArq}, linha ${numLinha}: formato de entrada inválido`;
        console.error(erro);
        throw new Error(erro);
    }
    
    // Validação do ingrediente
    if (!sigma.validaIngrediente(ingrediente)) {
        const erro = `[!] Em ${nomeArq}, linha ${numLinha}: ingrediente ${ingrediente} não reconhecido`;
        console.error(erro);
        throw new Error(erro);
    }
    
    if (!ok) {
        throw new Error("Estado de destino inválido");
    }
    
    receita.insereTransicao(estadoPartida, estadoDestino, ingrediente, desempilha, empilha);
    return receita;
}

// Função auxiliar para carregar receita de arquivo (simulando fetch para arquivos locais)
async function carregaReceitaDeArquivo(nomeArquivo, sigma) {
    try {
        // Simular carregamento de arquivo local
        // Na versão web, os arquivos de receita serão carregados como strings
        const response = await fetch(`pocoes/${nomeArquivo}.txt`);
        if (!response.ok) {
            throw new Error(`Arquivo não encontrado: ${nomeArquivo}.txt`);
        }
        const conteudo = await response.text();
        return carregaReceita(conteudo, sigma, nomeArquivo);
    } catch (error) {
        console.error(`Erro ao carregar receita ${nomeArquivo}: ${error.message}`);
        throw error;
    }
}

// Classe para gerenciar carregamento de receitas com dados estáticos
class GerenciadorReceitas {
    constructor() {
        // Dados das receitas como strings (convertidas dos arquivos .txt)
        this.receitas = {
            'pocao_da_sabedoria': `Q: I ing1 ing2 ing3 ing4 ing5 erro F
I: I
F: F
I -> ing1    | lol
ing1 -> ing2 | biz
ing1 -> erro | p
ing2 -> ing3 | pix
ing2 -> erro | a
ing3 -> ing4 | pum
ing3 -> erro | sos
ing4 -> ing5 | zap
ing4 -> erro | bur
ing5 -> F    | omg
ing5 -> erro | bab
F -> erro    | p`,
            
            'receita_da_morte': `Q: I ing1 ing2 ing3 ing4 erro F
I: I
F: F
I -> ing1    | pum
ing1 -> ing2 | sos
ing1 -> erro | pip
ing2 -> ing3 | bab
ing2 -> erro | biz
ing3 -> ing4 | nho
ing3 -> erro | lol
ing4 -> F    | p
ing4 -> erro | a
F -> erro    | o`,
            
            'pocao_de_restauracao_comum': `Q: I ing1 ing2 ing3 erro F
I: I
F: F
I -> ing1    | o
ing1 -> ing2 | a
ing1 -> erro | p
ing2 -> F    | a
ing2 -> erro | p
F -> erro    | p`,
            
            'pocao_ciclica': `Q: I ing1 ing2 ing3 ing4 erro F
I: I
F: F
I -> ing1       | bur, _ / _
ing1 -> ing2    | pix, _ / _
ing2 -> ing3    | pum, _ / _
ing3 -> ing4    | pix, _ / _
ing4 -> F       | bur, _ / _
ing4 -> erro    | pum, _ / biz
F -> erro       | p, _ / s`,
            
            'receita1': `Q: I ing1 ing2 ing3 erro F
I: I
F: F
I -> ing1       | o, _ / o
ing1 -> ing2    | a, _ / _
ing1 -> erro    | p, _ / mor
ing2 -> F       | a, o / _
ing2 -> erro    | p, _ / _
F -> erro       | p, _ / _`,
            
            'receitaAPD': `Q: I ing1 ing2 ing3 ing4 erro F
I: I
F: F
I -> ing1       | bur, _ / _
ing1 -> ing2    | a, _ / _
ing1 -> erro    | p, _ / biz
ing2 -> ing3    | omg, _ / _
ing2 -> erro    | pix, _ / s
ing3 -> ing4    | o, _ / _
ing3 -> erro    | pum, _ / mor
ing4 -> F       | lol, _ / _
ing4 -> erro    | biz, _ / biz
F -> erro       | p, _ / s`,
            
            'receitand': `Q: I ing1 ing2 ing3 erro F
I: I
F: F
I -> ing1       | o, _ / o
ing1 -> ing2    | a, _ / s
ing1 -> erro    | p, _ / mor
ing2 -> F       | a, _ / biz
ing2 -> erro    | a, _ / _
F -> erro       | p, _ / _`,
            
            'receitand2': `Q: I ing1 ing2 ing3 erro F
I: I
F: F
I -> ing1       | o
ing1 -> ing2    | a
ing1 -> erro    | p
ing2 -> F       | a
ing2 -> erro    | a
F -> erro       | p`
        };
    }

    async carregarReceita(nomeReceita, sigma) {
        if (!(nomeReceita in this.receitas)) {
            throw new Error(`Receita "${nomeReceita}" não encontrada`);
        }
        
        const conteudo = this.receitas[nomeReceita];
        return carregaReceita(conteudo, sigma, nomeReceita);
    }

    listarReceitas() {
        return Object.keys(this.receitas);
    }

    receitaExiste(nomeReceita) {
        return nomeReceita in this.receitas;
    }
}

// Exportar para uso global
window.carregaReceita = carregaReceita;
window.processaRegra = processaRegra;
window.imprimeFormato = imprimeFormato;
window.carregaReceitaDeArquivo = carregaReceitaDeArquivo;
window.GerenciadorReceitas = GerenciadorReceitas;
