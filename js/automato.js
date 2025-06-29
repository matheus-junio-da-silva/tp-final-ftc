// Realização dinâmica de um diagrama de estados
class Automato {
    constructor(receita) {
        this.erro = false;
        this.receita = receita;
        this.estadoAtual = receita.inicial;
        this.pilha = [];
        this.historico = [];
        this.passos = 0;
    }

    // Retorna o topo da pilha ou palavra vazia se ela estiver vazia
    topoPilha() {
        return this.pilha.length > 0 ? this.pilha.pop() : "_";
    }

    // Executa uma transição
    executaTransicao(ingrediente, reacoes) {
        if (this.erro) return false;
        
        this.passos++;
        const estadoAnterior = this.estadoAtual;
        const pilhaAnterior = [...this.pilha];
        
        const regras = this.receita.estados[this.estadoAtual].regras;
        
        if (!(ingrediente in regras)) {
            // Sem transição para o ingrediente fornecido; erro
            this.erro = true;
            this.adicionarHistorico(
                `Passo ${this.passos}: Erro - Não há transição para "${ingrediente}" no estado "${this.estadoAtual}"`,
                'error'
            );
            return false;
        }
        
        let saida = regras[ingrediente];
        let mensagemPilha = '';
        
        if (typeof saida === 'object' && !Array.isArray(saida)) {
            // Transição de autômato de pilha!
            let topo = this.topoPilha();
            
            if (!(topo in saida) && !("_" in saida)) {
                // Sem transição para o topo atual da pilha; erro
                this.erro = true;
                this.adicionarHistorico(
                    `Passo ${this.passos}: Erro - Não há transição para topo da pilha "${topo}" com entrada "${ingrediente}" no estado "${this.estadoAtual}"`,
                    'error'
                );
                return false;
            }
            
            if ("_" in saida && "_" !== topo) {
                const descricaoReacao = reacoes.descreveReacao(topo);
                mensagemPilha = `Mmmmm essa poção parece ${descricaoReacao}`;
                this.pilha.push(topo);
                topo = "_";
            }
            
            const [proximoEstado, empilha] = saida[topo];
            saida = proximoEstado;
            
            if (empilha !== "_") {
                const descricaoEmpilha = reacoes.descreveReacao(empilha);
                if (mensagemPilha) {
                    mensagemPilha += `\nMmmmm essa poção parece ${descricaoEmpilha}`;
                } else {
                    mensagemPilha = `Mmmmm essa poção parece ${descricaoEmpilha}`;
                }
                this.pilha.push(empilha);
            }
            
            if (this.pilha.length === 0) {
                if (mensagemPilha) {
                    mensagemPilha += "\nA poção parece boa";
                } else {
                    mensagemPilha = "A poção parece boa";
                }
            }
        }
        
        // Mudamos para o próximo estado!
        this.estadoAtual = saida;
        
        // Adicionar ao histórico
        let mensagemTransicao = `Passo ${this.passos}: "${estadoAnterior}" --[${ingrediente}]--> "${this.estadoAtual}"`;
        
        if (pilhaAnterior.length !== this.pilha.length || JSON.stringify(pilhaAnterior) !== JSON.stringify(this.pilha)) {
            mensagemTransicao += `\n  Pilha: [${pilhaAnterior.join(', ')}] → [${this.pilha.join(', ')}]`;
        }
        
        if (mensagemPilha) {
            mensagemTransicao += `\n  ${mensagemPilha}`;
        }
        
        this.adicionarHistorico(mensagemTransicao, 'info');
        
        return true;
    }

    // Checa se a computação foi corretamente concluída
    reconheceu() {
        const aceito = !this.erro && 
                      this.receita.finais.includes(this.estadoAtual) && 
                      this.pilha.length === 0;
        
        if (aceito) {
            this.adicionarHistorico(
                `✅ Poção aceita! Estado final: "${this.estadoAtual}", Pilha vazia: ${this.pilha.length === 0}`,
                'success'
            );
        } else {
            let motivoRejeicao = [];
            if (this.erro) {
                motivoRejeicao.push("erro durante execução");
            }
            if (!this.receita.finais.includes(this.estadoAtual)) {
                motivoRejeicao.push(`estado "${this.estadoAtual}" não é final`);
            }
            if (this.pilha.length > 0) {
                motivoRejeicao.push(`pilha não está vazia: [${this.pilha.join(', ')}]`);
            }
            
            this.adicionarHistorico(
                `❌ Poção rejeitada! Motivos: ${motivoRejeicao.join(', ')}`,
                'error'
            );
        }
        
        return aceito;
    }

    // Adiciona entrada ao histórico
    adicionarHistorico(mensagem, tipo = 'info') {
        this.historico.push({
            mensagem,
            tipo,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    // Obtém o histórico completo
    obterHistorico() {
        return this.historico;
    }

    // Reinicia o autômato
    reiniciar() {
        this.erro = false;
        this.estadoAtual = this.receita.inicial;
        this.pilha = [];
        this.historico = [];
        this.passos = 0;
        
        this.adicionarHistorico(
            `🔄 Autômato reiniciado. Estado inicial: "${this.estadoAtual}"`,
            'info'
        );
    }

    // Obtém o estado atual do autômato
    obterEstado() {
        return {
            estadoAtual: this.estadoAtual,
            pilha: [...this.pilha],
            erro: this.erro,
            passos: this.passos,
            aceito: this.reconheceu()
        };
    }

    // Verifica se o autômato está em estado de erro
    temErro() {
        return this.erro;
    }

    // Obtém informações sobre o tipo de autômato
    getTipoAutomato() {
        // Verifica se há transições que usam pilha
        for (const estado in this.receita.estados) {
            for (const ingrediente in this.receita.estados[estado].regras) {
                const saida = this.receita.estados[estado].regras[ingrediente];
                if (typeof saida === 'object' && !Array.isArray(saida)) {
                    return 'APD'; // Autômato de Pilha Determinístico
                }
            }
        }
        return 'AFD'; // Autômato Finito Determinístico
    }

    // Simula a execução completa de uma sequência de ingredientes
    simularExecucao(ingredientes, reacoes) {
        this.reiniciar();
        const resultados = [];
        
        for (let i = 0; i < ingredientes.length; i++) {
            const ingrediente = ingredientes[i];
            const sucesso = this.executaTransicao(ingrediente, reacoes);
            
            resultados.push({
                passo: i + 1,
                ingrediente,
                sucesso,
                estadoAtual: this.estadoAtual,
                pilha: [...this.pilha],
                erro: this.erro
            });
            
            if (this.erro) {
                break;
            }
        }
        
        const reconhecido = this.reconheceu();
        
        return {
            resultados,
            reconhecido,
            estadoFinal: this.estadoAtual,
            pilhaFinal: [...this.pilha],
            tipoAutomato: this.getTipoAutomato(),
            passos: this.passos
        };
    }

    // Obtém estatísticas da execução
    obterEstatisticas() {
        return {
            tipo: this.getTipoAutomato(),
            estadoAtual: this.estadoAtual,
            tamanhoEstados: Object.keys(this.receita.estados).length,
            tamanhoPilha: this.pilha.length,
            passos: this.passos,
            temErro: this.erro,
            estadosFinais: this.receita.finais,
            estadoInicial: this.receita.inicial
        };
    }
}

// Exportar para uso global
window.Automato = Automato;
