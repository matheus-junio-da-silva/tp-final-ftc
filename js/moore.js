/**
 * Moore functions - JavaScript equivalent of moore.py
 * Handles Moore machine functionality with sequential potion creation
 */

// Realização dinâmica de uma máquina de Moore
class Moore {
    constructor() {
        this.estados = {};
        this.estadoAtual = 'S0'; // Estado inicial
        this.sequencia = [
            'biz', 'bab', 'nho', 'pip', 'pum',
            'bur', 'pix', 'zap', 'sos', 'lol',
            'p', 'a', 'o', 'omg'
        ];
        this.ingredienteEsperado = 'biz';
        this.ingredientesUsados = [];
        this.historico = [];
        this.progresso = 0;
        this.definirEstados();
        this.definirAlfabeto();
    }

    async run(sigma) {
        this.primeiro = true;
        this.progresso = 0;
        this.ingredientesUsados = [];
        this.historico = [];
        this.estadoAtual = 'S0'; // Reiniciar para estado inicial
        this.ingredienteEsperado = this.sequencia[0];
        
        this.adicionarHistorico("🔮 Iniciando sequência mágica com a Máquina de Moore...", 'info');
        this.adicionarHistorico("⚗️ O caldeirão está pronto para a sequência específica!", 'info');
        this.adicionarHistorico(`📍 Estado inicial: ${this.estadoAtual}`, 'info');
        this.adicionarHistorico(`🎯 Primeiro ingrediente esperado: ${this.ingredienteEsperado}`, 'info');
    }

    adicionarIngrediente(ingrediente, sigma) {
        if (!sigma.validaIngrediente(ingrediente)) {
            this.adicionarHistorico(`❌ Ingrediente "${ingrediente}" não reconhecido!`, 'error');
            return false;
        }

        const estadoAnterior = this.estadoAtual;
        const progressoAnterior = this.progresso;

        // Verificar se é o ingrediente esperado na sequência
        if (ingrediente === this.ingredienteEsperado) {
            this.progresso++;
            this.ingredientesUsados.push(ingrediente);
            
            // Transição de estado
            this.estadoAtual = `S${this.progresso}`;
            
            // Determinar próximo ingrediente esperado
            if (this.progresso < this.sequencia.length) {
                this.ingredienteEsperado = this.sequencia[this.progresso];
            } else {
                this.ingredienteEsperado = 'COMPLETA';
            }

            // Saída do estado (característica da Máquina de Moore)
            const saida = this.obterSaidaEstado(this.estadoAtual);

            this.adicionarHistorico(
                `✅ ${this.progresso}. Ingrediente "${ingrediente}" adicionado corretamente!`, 
                'success'
            );
            this.adicionarHistorico(`   🔄 Transição: ${estadoAnterior} → ${this.estadoAtual}`, 'info');
            this.adicionarHistorico(`   🎭 Saída do estado: ${saida}`, 'success');
            
            if (this.progresso < this.sequencia.length) {
                this.adicionarHistorico(`   🎯 Próximo ingrediente esperado: ${this.ingredienteEsperado}`, 'info');
            } else {
                this.adicionarHistorico(`   🏁 Sequência completa! Estado final atingido.`, 'success');
            }

        } else {
            // Ingrediente incorreto - resetar para estado inicial
            this.estadoAtual = 'S0';
            this.progresso = 0;
            this.ingredienteEsperado = this.sequencia[0];
            
            this.adicionarHistorico(
                `💥 ERRO! Ingrediente "${ingrediente}" incorreto! Esperava "${this.sequencia[progressoAnterior]}"`, 
                'error'
            );
            this.adicionarHistorico(`   🔄 Resetando para estado inicial: ${this.estadoAtual}`, 'warning');
            this.adicionarHistorico(`   🎯 Ingrediente esperado agora: ${this.ingredienteEsperado}`, 'info');
        }

        return true;
    }

    obterSaidaEstado(estado) {
        const saidas = {
            'S0': '⚗️ Caldeirão vazio - Aguardando primeiro ingrediente',
            'S1': '🌫️ Fumaça verde emerge do caldeirão...',
            'S2': '💫 Brilho fraco pulsante aparece',
            'S3': '🌀 Bolhas azuis começam a flutuar',
            'S4': '🔥 Chamas suaves dançam na superfície',
            'S5': '💨 Vapor roxo forma espirais místicas',
            'S6': '🌈 Arco-íris etéreo cruza o caldeirão',
            'S7': '⚡ Faíscas douradas saltam das bordas',
            'S8': '🌡️ Caldeirão fumegante com aroma doce',
            'S9': '📖 Páginas invisíveis viram sozinhas no ar',
            'S10': '🥚 Forma ovóide pulsante se materializa',
            'S11': '🌹 Pétalas mágicas flutuam graciosamente',
            'S12': '💧 Água cristalina brilha intensamente',
            'S13': '😢 Uma lágrima cintilante se forma',
            'S14': '✨ POÇÃO MÁGICA COMPLETADA! Luz dourada irradia!'
        };
        return saidas[estado] || '❓ Estado desconhecido';
    }

    avaliarSequencia() {
        this.adicionarHistorico("\n" + "=".repeat(50), 'info');
        this.adicionarHistorico("🔍 Avaliando sequência da Máquina de Moore...", 'info');

        if (this.progresso === this.sequencia.length) {
            this.adicionarHistorico("🏆 SEQUÊNCIA PERFEITA! Todos os ingredientes foram adicionados na ordem correta!", 'success');
            this.adicionarHistorico("✨ A poção mágica foi criada com sucesso seguindo a máquina de Moore!", 'success');
            return "Poção Mágica Completa";
        } else {
            this.adicionarHistorico(`⚠️ Sequência incompleta. Progresso: ${this.progresso}/${this.sequencia.length}`, 'warning');
            this.adicionarHistorico(`🎯 Próximo ingrediente necessário: ${this.ingredienteEsperado}`, 'info');
            return `Sequência Incompleta (${this.progresso}/${this.sequencia.length})`;
        }
    }

    // Métodos auxiliares similares aos da Mealy
    definirEstados() {
        // Estados da máquina de Moore (S0 a S14)
        for (let i = 0; i <= 14; i++) {
            this.estados[`S${i}`] = {
                id: `S${i}`,
                saida: this.obterSaidaEstado(`S${i}`),
                transicoes: {}
            };
        }
    }

    definirAlfabeto() {
        this.alfabeto = [
            'biz', 'bab', 'nho', 'pip', 'pum',
            'bur', 'pix', 'zap', 'sos', 'lol',
            'p', 'a', 'o', 'omg'
        ];
    }

    getEstados() {
        return this.estados;
    }

    getSequencia() {
        return this.sequencia;
    }

    getReceitas() {
        return [
            "🔮 Sequência Completa da Máquina de Moore:",
            "1. biz (biscoito de bruxa) - Início da magia",
            "2. bab (baba de camelo) - Viscosidade mística", 
            "3. nho (nhonho de gato) - Suavidade felina",
            "4. pip (pipoca mágica) - Explosão de sabor",
            "5. pum (pum de dragão) - Poder dracônico",
            "6. bur (buraco negro) - Densidade infinita",
            "7. pix (pixie dust) - Magia das fadas",
            "8. zap (energia elétrica) - Vitalidade pura",
            "9. sos (sossega leão) - Tranquilidade",
            "10. lol (riso mágico) - Alegria eterna",
            "11. p (pétalas) - Beleza natural",
            "12. a (água pura) - Essência da vida", 
            "13. o (óleo sagrado) - Unção mística",
            "14. omg (concentrado divino) - Finalização épica"
        ];
    }

    criarTabelaMaquina() {
        let tabela = `
            <div class="machine-table">
                <h4>📊 Estrutura da Máquina de Moore</h4>
                <p><strong>Tipo:</strong> Máquina de Moore (saída depende apenas do estado)</p>
                <p><strong>Estados:</strong> S0, S1, S2, ..., S14 (15 estados)</p>
                <p><strong>Estado Inicial:</strong> S0</p>
                <p><strong>Estado Final:</strong> S14</p>
                <p><strong>Alfabeto:</strong> {${this.alfabeto.join(', ')}}</p>
                
                <h5>🔄 Função de Transição:</h5>
                <div class="transition-info">
                    <p>δ(Si, ingrediente) = Si+1 se ingrediente = sequencia[i]</p>
                    <p>δ(Si, ingrediente) = S0 se ingrediente ≠ sequencia[i]</p>
                </div>
                
                <h5>📤 Função de Saída (característica de Moore):</h5>
                <div class="output-info">
                    <p>λ(Si) = saída específica do estado Si</p>
                    <p>A saída depende apenas do estado atual, não da entrada</p>
                </div>
            </div>
        `;
        return tabela;
    }

    adicionarHistorico(mensagem, tipo = 'info') {
        if (!this.historico) {
            this.historico = [];
        }
        this.historico.push({
            mensagem,
            tipo,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    obterHistorico() {
        return this.historico || [];
    }

    reiniciar() {
        this.primeiro = true;
        this.progresso = 0;
        this.ingredientesUsados = [];
        this.historico = [];
        this.estadoAtual = 'S0';
        this.ingredienteEsperado = this.sequencia[0];
    }

    obterEstado() {
        return {
            estado: this.estadoAtual,
            progresso: this.progresso,
            total: this.sequencia.length,
            ingredienteEsperado: this.ingredienteEsperado,
            ingredientesUsados: this.ingredientesUsados.length,
            sequenciaCompleta: this.progresso === this.sequencia.length
        };
    }
}
