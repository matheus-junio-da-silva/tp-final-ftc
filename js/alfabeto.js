// Função para carregar alfabeto de uma string de arquivo
function carregaAlfabeto(conteudoArq, natureza, nomeArq) {
    let numLinha = 0;
    const alfabeto = {};
    const linhas = conteudoArq.trim().split('\n');
    
    for (const linha of linhas) {
        numLinha++;
        if (linha.trim() === '') continue;
        
        const partes = linha.split(':');
        if (partes.length !== 2) {
            throw new Error(`Na linha ${numLinha}, lista de ${natureza} '${nomeArq}': formato inválido. Use 'símbolo:descrição'`);
        }
        
        const sim = partes[0].trim();
        const desc = partes[1].trim();
        
        if (sim.length >= 4 || !sim) {
            throw new Error(`Na linha ${numLinha}, lista de ${natureza} '${nomeArq}': símbolo deve ter entre 1 e 3 caracteres`);
        }
        
        alfabeto[sim] = desc;
    }
    return alfabeto;
}

// Classe que agrupa todos os símbolos permitidos no programa, incluindo
// ingredientes e reações. Usado para validação
class Alfabeto {
    constructor(conteudoIngredientes, conteudoReacoes) {
        try {
            this.ingredientes = carregaAlfabeto(conteudoIngredientes, "ingredientes", "ingredientes.txt");
        } catch (e) {
            console.error(`> alfabeto: [!] Não foi possível processar o arquivo de ingredientes. Erro: ${e.message}`);
            throw new Error("Erro ao carregar ingredientes");
        }
        
        try {
            this.reacoes = carregaAlfabeto(conteudoReacoes, "reações", "reacoes.txt");
        } catch (e) {
            console.error(`> alfabeto: [!] Não foi possível processar o arquivo de reações. Erro: ${e.message}`);
            throw new Error("Erro ao carregar reações");
        }
    }

    validaIngrediente(ing) {
        return ing === "_" || ing in this.ingredientes;
    }

    descreveIngrediente(ing) {
        return this.ingredientes[ing] || "";
    }

    validaReacao(re) {
        return re === "_" || re in this.reacoes;
    }

    descreveReacao(re) {
        return this.reacoes[re] || "";
    }
    
    listaIngredientes() {
        // Cabeçalhos das colunas
        const cabecalho = ["Símbolo", "Ingrediente"];

        // Comprimento máximo de cada coluna
        const chaves = Object.keys(this.ingredientes);
        const valores = Object.values(this.ingredientes);
        
        const larguraSimbolo = Math.max(cabecalho[0].length, Math.max(...chaves.map(k => k.length)));
        const larguraIngrediente = Math.max(cabecalho[1].length, Math.max(...valores.map(v => v.length)));
        const larguraTotal = larguraSimbolo + larguraIngrediente + 7;

        let resultado = '';

        // Título
        resultado += Terminal.magenta(`+${'-'.repeat(larguraTotal - 2)}+\n`);
        resultado += Terminal.magenta(`| ${'Ingredientes na mesa:'.padStart((larguraTotal - 4 + 'Ingredientes na mesa:'.length) / 2).padEnd(larguraTotal - 4)} |\n`);

        // Cabeçalho
        resultado += Terminal.magenta(`+${'-'.repeat(larguraTotal - 2)}+\n`);
        resultado += Terminal.magenta(`| ${'Símbolo'.padStart((larguraSimbolo + 'Símbolo'.length) / 2).padEnd(larguraSimbolo)} | ${'Ingrediente'.padStart((larguraIngrediente + 'Ingrediente'.length) / 2).padEnd(larguraIngrediente)} |\n`);
        resultado += Terminal.magenta(`+${'-'.repeat(larguraSimbolo + 2)}+${'-'.repeat(larguraIngrediente + 2)}+\n`);

        // Ingredientes 
        for (const [chave, valor] of Object.entries(this.ingredientes)) {
            const chaveCentralizada = chave.padStart((larguraSimbolo + chave.length) / 2).padEnd(larguraSimbolo);
            const valorAlinhado = valor.padEnd(larguraIngrediente);
            resultado += Terminal.magenta(`| ${chaveCentralizada} | ${valorAlinhado} |\n`);
        }

        resultado += Terminal.magenta(`+${'-'.repeat(larguraTotal - 2)}+\n`);
        
        return resultado;
    }

    // Método para criar tabela HTML dos ingredientes
    criarTabelaIngredientes() {
        let html = '<table class="ingredients-table">';
        html += '<thead><tr><th>Símbolo</th><th>Ingrediente</th></tr></thead>';
        html += '<tbody>';
        
        for (const [simbolo, descricao] of Object.entries(this.ingredientes)) {
            html += `<tr><td>${simbolo}</td><td>${descricao}</td></tr>`;
        }
        
        html += '</tbody></table>';
        return html;
    }

    // Método para obter lista de ingredientes como array
    getIngredientesArray() {
        return Object.entries(this.ingredientes).map(([simbolo, descricao]) => ({
            simbolo,
            descricao
        }));
    }

    // Método para obter lista de reações como array
    getReacoesArray() {
        return Object.entries(this.reacoes).map(([simbolo, descricao]) => ({
            simbolo,
            descricao
        }));
    }
}

// Exportar para uso global
window.Alfabeto = Alfabeto;
window.carregaAlfabeto = carregaAlfabeto;
