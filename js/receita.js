/**
 * Receita functions - JavaScript equivalent of receita.py
 * Handles automaton rules and transitions
 */

// Exceção personalizada para erros de transição
class ErroTransicao extends Error {
    constructor(message) {
        super(message);
        this.name = "ErroTransicao";
        if (typeof Terminal !== 'undefined') {
            console.error(Terminal.red("\nPor favor verificar determinismo"));
        } else {
            console.error("\nPor favor verificar determinismo");
        }
    }
}

// Regras de transição para um único estado
class Regras {
    constructor(nome) {
        this.regras = {};
        this.nomeEstado = nome;
    }

    insere(estadoDestino, ingrediente, desempilha = null, empilha = null) {
        /**
         * Insere uma transição qualquer, decidindo se ela é de AFD ou de APD
         * baseando-se na presença ou ausência dos argumentos empilha e desempilha
         */
        if (!desempilha && !empilha) {
            this.insereAfd(estadoDestino, ingrediente);
            return;
        }
        this.insereApd(estadoDestino, ingrediente, desempilha, empilha);
    }

    insereAfd(estadoDestino, ingrediente) {
        /**
         * Insere uma transição de AFD, em que a leitura de um ingrediente
         * leva do estado atual para um estado de destino.
         */        if (ingrediente in this.regras || ingrediente === "_") {
            const erro = `[!] A transição "${ingrediente}" no estado ${this.nomeEstado} é compatível`;
            if (typeof Terminal !== 'undefined') {
                console.error(Terminal.red(erro));
            } else {
                console.error(erro);
            }
            throw new ErroTransicao("Não é determinístico");
        }
        this.regras[ingrediente] = estadoDestino;
    }    insereApd(estadoDestino, ingrediente, desempilha, empilha) {
        /**
         * Insere uma transição de APD, em que a leitura de um ingrediente e o
         * símbolo no topo da pilha ("desempilha") levam do estado atual para um
         * estado de destino, empilhando um símbolo ("empilha")
         */
        
        // verificando se a transição é compatível
        if ("_" in this.regras) {
            if (desempilha === "_") {
                const primeiraChave = Object.keys(this.regras["_"])[0];
                const erro = `[!] A transição "${ingrediente}, ${desempilha} / ${empilha}" é compatível com a transição "_, ${primeiraChave}" no estado ${this.nomeEstado}`;
                if (typeof Terminal !== 'undefined') {
                    console.error(Terminal.red(erro));
                } else {
                    console.error(erro);
                }
                throw new ErroTransicao("Não é determinístico");
            }
        }
          if (ingrediente in this.regras) {
            if (desempilha in this.regras[ingrediente] || desempilha === "_" || "_" in this.regras[ingrediente]) {
                const primeiraChave = Object.keys(this.regras[ingrediente])[0];
                const erro = `[!] A transição "${ingrediente}, ${desempilha} / ${empilha}" é compatível com a transição "${ingrediente}, ${primeiraChave}" no estado ${this.nomeEstado}`;
                if (typeof Terminal !== 'undefined') {
                    console.error(Terminal.red(erro));
                } else {
                    console.error(erro);
                }
                throw new ErroTransicao("Não é determinístico");
            }        } else if (ingrediente === "_") {
            for (const ing in this.regras) {
                for (const des in this.regras[ing]) {
                    if ("_" === des) {
                        const erro = `[!] A transição "${ingrediente}, ${desempilha} / ${empilha}" é compatível com a transição "${ing}, ${des}" no estado ${this.nomeEstado}`;
                        if (typeof Terminal !== 'undefined') {
                            console.error(Terminal.red(erro));
                        } else {
                            console.error(erro);
                        }
                        throw new ErroTransicao("Não é determinístico");
                    }
                }
            }
        }
        
        if (!(ingrediente in this.regras)) {
            this.regras[ingrediente] = {};
        } else if (typeof this.regras[ingrediente] !== 'object' || Array.isArray(this.regras[ingrediente])) {
            // Caso particular meio complicado aqui. Pode ser que uma transição
            // para esse ingrediente tenha sido inserida como AFD. Precisamos
            // converter a posição na lista desse ingrediente em um dicionário
            // antes de mais nada
            const estadoDestino_temp = this.regras[ingrediente];
            this.regras[ingrediente] = {};
            this.regras[ingrediente]["_"] = [estadoDestino_temp, "_"];
        }
        this.regras[ingrediente][desempilha] = [estadoDestino, empilha];
    }
}

// A receita nada mais é do que a especificação de um autômato
class Receita {
    constructor(estados, inicial, finais) {
        this.estados = {};
        for (const estado of estados) {
            this.estados[estado] = new Regras(estado);
        }
        this.inicial = inicial;
        this.finais = finais;
    }

    insereTransicao(estadoPartida, estadoDestino, ing, desempilha = null, empilha = null) {
        this.estados[estadoPartida].insere(estadoDestino, ing, desempilha, empilha);
    }    imprime() {
        let resultado = '';
        
        for (const estado in this.estados) {
            if (typeof Terminal !== 'undefined') {
                resultado += Terminal.magenta(`Estado: ${estado}\n`);
                resultado += Terminal.magenta("Transições:\n");
            } else {
                resultado += `Estado: ${estado}\n`;
                resultado += "Transições:\n";
            }

            for (const [ing, saida] of Object.entries(this.estados[estado].regras)) {
                if (typeof saida !== 'object' || Array.isArray(saida)) {
                    // Transição de AF: simples e direta
                    if (typeof Terminal !== 'undefined') {
                        resultado += Terminal.green(`\tEntrada: ${ing}`) + Terminal.white(" --> ") + Terminal.magenta(`${saida}\n`);
                    } else {
                        resultado += `\tEntrada: ${ing} --> ${saida}\n`;
                    }
                    continue;
                }
                  // Múltiplas transições de AP
                for (const [desempilha, [estadoDestino, empilha]] of Object.entries(saida)) {
                    if (typeof Terminal !== 'undefined') {
                        resultado += Terminal.green(`\tEntrada: ${ing}`) + Terminal.blue(`, ${desempilha}`) + Terminal.white(" --> ") + Terminal.magenta(`${estadoDestino}`) + Terminal.white(" / ") + Terminal.cyan(`${empilha}\n`);
                    } else {
                        resultado += `\tEntrada: ${ing}, ${desempilha} --> ${estadoDestino} / ${empilha}\n`;
                    }
                }
            }
           
            if (typeof Terminal !== 'undefined') {
                resultado += Terminal.magenta("-".repeat(30) + "\n");
            } else {
                resultado += "-".repeat(30) + "\n";
            }
        }
        
        return resultado;
    }

    // Método para gerar HTML da receita
    gerarHtmlReceita() {
        let html = '<div class="recipe-display">';
        
        for (const estado in this.estados) {
            html += `<div class="state">`;
            html += `<div class="state-name">Estado: ${estado}</div>`;
            html += `<div>Transições:</div>`;

            for (const [ing, saida] of Object.entries(this.estados[estado].regras)) {
                if (typeof saida !== 'object' || Array.isArray(saida)) {
                    // Transição de AF: simples e direta
                    html += `<div class="transition">`;
                    html += `<span class="input">Entrada: ${ing}</span> --> <span class="output">${saida}</span>`;
                    html += `</div>`;
                    continue;
                }
                
                // Múltiplas transições de AP
                for (const [desempilha, [estadoDestino, empilha]] of Object.entries(saida)) {
                    html += `<div class="transition">`;
                    html += `<span class="input">Entrada: ${ing}</span><span class="stack">, ${desempilha}</span> --> <span class="output">${estadoDestino}</span> / <span class="stack">${empilha}</span>`;
                    html += `</div>`;
                }
            }
            
            html += `</div>`;
        }
        
        html += '</div>';
        return html;
    }

    // Método para obter informações da receita
    getInfo() {
        return {
            estados: Object.keys(this.estados),
            inicial: this.inicial,
            finais: this.finais,
            numeroEstados: Object.keys(this.estados).length,
            numeroTransicoes: this.contarTransicoes()
        };
    }

    contarTransicoes() {
        let count = 0;
        for (const estado in this.estados) {
            for (const ing in this.estados[estado].regras) {
                const saida = this.estados[estado].regras[ing];
                if (typeof saida !== 'object' || Array.isArray(saida)) {
                    count++;
                } else {
                    count += Object.keys(saida).length;
                }
            }
        }
        return count;
    }

    // Método para validar a estrutura da receita
    validar() {
        const erros = [];
        
        // Verificar se o estado inicial existe
        if (!(this.inicial in this.estados)) {
            erros.push(`Estado inicial "${this.inicial}" não existe na lista de estados`);
        }
        
        // Verificar se todos os estados finais existem
        for (const estadoFinal of this.finais) {
            if (!(estadoFinal in this.estados)) {
                erros.push(`Estado final "${estadoFinal}" não existe na lista de estados`);
            }
        }
        
        // Verificar se todas as transições apontam para estados válidos
        for (const [nomeEstado, regrasEstado] of Object.entries(this.estados)) {
            for (const [ing, saida] of Object.entries(regrasEstado.regras)) {
                if (typeof saida !== 'object' || Array.isArray(saida)) {
                    // AFD
                    if (!(saida in this.estados)) {
                        erros.push(`Transição do estado "${nomeEstado}" com entrada "${ing}" aponta para estado inexistente "${saida}"`);
                    }
                } else {
                    // APD
                    for (const [desempilha, [estadoDestino, empilha]] of Object.entries(saida)) {
                        if (!(estadoDestino in this.estados)) {
                            erros.push(`Transição do estado "${nomeEstado}" com entrada "${ing},${desempilha}" aponta para estado inexistente "${estadoDestino}"`);
                        }
                    }
                }
            }
        }
        
        return erros;
    }
}

// Exportar para uso global
window.Receita = Receita;
window.Regras = Regras;
window.ErroTransicao = ErroTransicao;
