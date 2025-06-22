/**
 * Main functions - JavaScript equivalent of main.py
 * Main application controller for the potion creation simulator
 */

class AlquimiaApp {
    constructor() {
        this.currentScreen = 'title-screen';
        this.alfabeto = null;
        this.receitaAtual = null;
        this.automato = null;
        this.mealy = null;
        this.gerenciadorReceitas = null;
        this.soundManager = null;
        this.ingredientesAdicionados = [];
        this.primeiroIngrediente = true;

        // Dados dos alfabetos (convertidos dos arquivos .txt)
        this.dadosIngredientes = `dan : fio de cabelo do Daniel
sap : pele seca de sapo cururu
olh : olho de marmota africana
jub : uma jujubinha
gam : extrato defumado de chule de gamba
alh : alho
sal : sal
cas : casca de carvalho envelhecido
cob : veneno de cobra
ftc : uma pagina do livro de FTC
o   : ovo
p   : petala
a   : agua
lst : lagrima de estudante`;

        this.dadosReacoes = `a  : apimentada
s  : salgada demais
mor: mortífera
biz: bizarrésima`;

        // Aguardar que todas as dependências estejam carregadas
        this.waitForDependencies().then(() => {
            this.init();
        });
    }

    async waitForDependencies() {
        const checkDependencies = () => {
            return typeof Terminal !== 'undefined' && 
                   typeof GerenciadorReceitas !== 'undefined' &&
                   typeof Alfabeto !== 'undefined' &&
                   typeof Automato !== 'undefined' &&
                   typeof Mealy !== 'undefined';
        };

        if (checkDependencies()) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (checkDependencies()) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }    async init() {
        try {
            // Inicializar gerenciador de receitas
            this.gerenciadorReceitas = new GerenciadorReceitas();
            
            // Inicializar gerenciador de som
            this.soundManager = initSoundManager();
            
            // Carregar alfabeto
            this.alfabeto = new Alfabeto(this.dadosIngredientes, this.dadosReacoes);
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Mostrar tela inicial
            this.showScreen('title-screen');
            
            console.log('🧙‍♂️ Alquimia Automática inicializada com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            this.showError('Erro ao inicializar a aplicação. Verifique o console para detalhes.');
        }
    }

    setupEventListeners() {
        // Tela inicial
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.soundManager.playBackgroundMusic();
            this.showScreen('main-menu');
        });

        // Menu principal
        document.getElementById('automato-btn')?.addEventListener('click', () => {
            this.showScreen('recipe-selection');
        });

        document.getElementById('mealy-btn')?.addEventListener('click', () => {
            this.mealy = new Mealy();
            this.showScreen('mealy-machine');
        });

        document.getElementById('turing-btn')?.addEventListener('click', () => {
        this.showScreen('turing-machine');
        });


        document.getElementById('exit-btn')?.addEventListener('click', () => {
            this.exit();
        });

        // Seleção de receita
        document.getElementById('load-recipe-btn')?.addEventListener('click', () => {
            this.loadRecipe();
        });

        // Cards de receita
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', () => {
                const recipeName = card.getAttribute('data-recipe');
                document.getElementById('recipe-input').value = recipeName;
                this.loadRecipe();
            });
        });

        // Criação de poção (AFD/APD)
        document.getElementById('add-ingredient-btn')?.addEventListener('click', () => {
            this.addIngredient();
        });

        document.getElementById('finish-potion-btn')?.addEventListener('click', () => {
            this.finishPotion();
        });

        document.getElementById('show-recipe-btn')?.addEventListener('click', () => {
            this.showRecipe();
        });

        document.getElementById('show-ingredients-btn')?.addEventListener('click', () => {
            this.showIngredients();
        });

        // Máquina de Mealy
        document.getElementById('mealy-add-btn')?.addEventListener('click', () => {
            this.addMealyIngredient();
        });

        document.getElementById('mealy-finish-btn')?.addEventListener('click', () => {
            this.finishMealyPotion();
        });

        // Modal
        document.querySelector('.close')?.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (event) => {
            const modal = document.getElementById('info-modal');
            if (event.target === modal) {
                this.closeModal();
            }
        });

        // Tela de resultado
        document.getElementById('new-potion-btn')?.addEventListener('click', () => {
            this.newPotion();
        });

        document.getElementById('back-menu-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });        // Enter nos campos de input
        document.getElementById('recipe-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadRecipe();
            }
        });

        document.getElementById('ingredient-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addIngredient();
            }
        });

        document.getElementById('mealy-ingredient-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addMealyIngredient();
            }
        });

        // Controle de som
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            const enabled = this.soundManager.toggleSound();
            const button = document.getElementById('sound-toggle');
            button.innerHTML = enabled ? '🔊' : '🔇';
            button.title = enabled ? 'Desligar Som' : 'Ligar Som';
        });
    }

    showScreen(screenId) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar tela específica
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    async loadRecipe() {
        const recipeInput = document.getElementById('recipe-input');
        const recipeName = recipeInput.value.trim();

        if (!recipeName) {
            this.showError('Por favor, insira o nome de uma receita.');
            return;
        }

        try {
            this.receitaAtual = await this.gerenciadorReceitas.carregarReceita(recipeName, this.alfabeto);
            
            if (!this.receitaAtual) {
                this.showError(`Receita "${recipeName}" não encontrada ou contém erros.`);
                return;
            }

            // Validar receita
            const erros = this.receitaAtual.validar();
            if (erros.length > 0) {
                this.showError(`Receita inválida:\n${erros.join('\n')}`);
                return;
            }

            // Criar novo autômato
            this.automato = new Automato(this.receitaAtual);
            
            // Resetar estado
            this.ingredientesAdicionados = [];
            this.primeiroIngrediente = true;
              // Limpar log
            const log = document.getElementById('potion-log');
            if (log) {
                if (typeof Terminal !== 'undefined') {
                    Terminal.clear(log);
                } else {
                    log.innerHTML = '';
                }
            }

            // Atualizar interface
            this.updateIngredientLabel();
            
            // Mostrar tela de criação
            this.showScreen('potion-creation');
            
            // Log inicial
            if (typeof Terminal !== 'undefined') {
                Terminal.log(log, `🧪 Receita "${recipeName}" carregada com sucesso!`, 'success');
                Terminal.log(log, `📊 Tipo: ${this.automato.getTipoAutomato()}`, 'info');
                Terminal.log(log, `🎯 Estado inicial: ${this.receitaAtual.inicial}`, 'info');
                Terminal.log(log, `🏁 Estados finais: ${this.receitaAtual.finais.join(', ')}`, 'info');
            } else {
                if (log) {
                    log.innerHTML += `<div>🧪 Receita "${recipeName}" carregada com sucesso!</div>`;
                    log.innerHTML += `<div>📊 Tipo: ${this.automato.getTipoAutomato()}</div>`;
                    log.innerHTML += `<div>🎯 Estado inicial: ${this.receitaAtual.inicial}</div>`;
                    log.innerHTML += `<div>🏁 Estados finais: ${this.receitaAtual.finais.join(', ')}</div>`;
                }
            }

        } catch (error) {
            console.error('Erro ao carregar receita:', error);
            this.showError(`Erro ao carregar receita: ${error.message}`);
        }
    }

    addIngredient() {
        const input = document.getElementById('ingredient-input');
        const ingredient = input.value.trim().toLowerCase();

        if (!ingredient) {
            this.showError('Por favor, insira um ingrediente.');
            return;
        }

        if (!this.alfabeto.validaIngrediente(ingredient)) {
            this.showError(`Ingrediente "${ingredient}" não reconhecido.`);
            soundGameOver();
            return;
        }

        // Executar transição
        const sucesso = this.automato.executaTransicao(ingredient, this.alfabeto);
        
        if (sucesso) {
            soundAddIngrediente();
            this.ingredientesAdicionados.push({
                simbolo: ingredient,
                nome: this.alfabeto.descreveIngrediente(ingredient)
            });
        } else {
            soundGameOver();
        }

        // Atualizar log
        this.updatePotionLog();

        // Limpar input
        input.value = '';

        // Atualizar interface
        if (this.primeiroIngrediente) {
            this.primeiroIngrediente = false;
            this.updateIngredientLabel();
            document.getElementById('finish-potion-btn').style.display = 'inline-block';
        }

        // Verificar se há erro
        if (this.automato.temErro()) {
            setTimeout(() => {
                this.showResult(false, 'Falha na poção - erro de transição');
            }, 1000);
        }
    }

    finishPotion() {
        const reconhecido = this.automato.reconheceu();
        const nomeReceita = document.getElementById('recipe-input').value.replace('_', ' ');
        
        this.updatePotionLog();

        if (reconhecido) {
            soundPocaoCriada();
            this.showResult(true, `${nomeReceita} criada com sucesso!`);
        } else {
            soundGameOver();
            this.showResult(false, 'Falha na criação da poção');
        }
    }

    addMealyIngredient() {
        const input = document.getElementById('mealy-ingredient-input');
        const ingredient = input.value.trim().toLowerCase();

        if (!ingredient) {
            this.showError('Por favor, insira um ingrediente.');
            return;
        }

        const sucesso = this.mealy.adicionarIngrediente(ingredient, this.alfabeto);
        
        if (sucesso) {
            soundAddIngrediente();
            
            // Atualizar estatísticas
            this.updateMealyStats();
            
            // Atualizar log
            this.updateMealyLog();
            
            // Limpar input
            input.value = '';
            
            // Atualizar interface
            if (this.mealy.primeiro) {
                this.mealy.primeiro = false;
                document.getElementById('mealy-ingredient-label').textContent = 'Símbolo do ingrediente:';
                document.getElementById('mealy-finish-btn').style.display = 'inline-block';
            }
        } else {
            soundGameOver();
        }
    }

    async finishMealyPotion() {
        const resultado = this.mealy.avaliarPocao();
        
        // Atualizar log final
        this.updateMealyLog();
        
        // Mostrar animação do corvo
        await this.showCorvoAnimation(resultado);
        
        // Mostrar resultado
        setTimeout(() => {
            this.showMealyResult(resultado);
        }, 2000);
    }

    async showCorvoAnimation(resultado) {
        const corvo = document.getElementById('corvo');
        const speechBubble = document.getElementById('speech-bubble');
        const speechText = document.getElementById('speech-text');

        if (!corvo || !speechBubble || !speechText) return;

        // Animação de avaliação
        for (let i = 0; i < 4; i++) {
            speechText.textContent = `O corvo provador está avaliando${'...'.substring(0, i + 1)}`;
            speechBubble.style.display = 'block';
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Som do corvo
        let corvoSound = null;
        if (resultado.motivo !== 'sabor_negativo') {
            corvoSound = soundCorvo();
        }

        // Resultado da avaliação
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (resultado.sucesso) {
            if (resultado.motivo === 'poder_supremo') {
                speechText.innerHTML = '🌟 Esta poção é LENDÁRIA! Vou levá-la comigo!';
                soundCorvoWin();
                if (corvoSound) stopCorvoSound(corvoSound);
            } else {
                speechText.innerHTML = '✨ Poção avaliada! Veja os resultados abaixo.';
            }
        } else {
            speechText.innerHTML = '💀 Esta poção não passou no teste...';
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        speechBubble.style.display = 'none';
        
        if (corvoSound && resultado.motivo !== 'poder_supremo') {
            stopCorvoSound(corvoSound);
        }
    }

    updateIngredientLabel() {
        const label = document.getElementById('ingredient-label');
        if (label) {
            if (this.primeiroIngrediente) {
                label.textContent = 'Insira o símbolo do primeiro ingrediente:';
            } else {
                label.textContent = 'Símbolo do ingrediente:';
            }
        }
    }

    updatePotionLog() {
        const log = document.getElementById('potion-log');
        if (!log) return;

        Terminal.clear(log);
        
        // Mostrar histórico do autômato
        const historico = this.automato.obterHistorico();
        historico.forEach(entrada => {
            Terminal.log(log, entrada.mensagem, entrada.tipo);
        });
    }

    updateMealyLog() {
        const log = document.getElementById('mealy-log');
        if (!log) return;

        Terminal.clear(log);
        
        // Mostrar histórico da máquina de Mealy
        const historico = this.mealy.obterHistorico();
        historico.forEach(entrada => {
            Terminal.log(log, entrada.mensagem, entrada.tipo);
        });
    }

    updateMealyStats() {
        const estado = this.mealy.obterEstado();
        
        document.getElementById('sabor-value').textContent = estado.sabor;
        document.getElementById('poder-value').textContent = estado.poder;
        document.getElementById('ingredient-count').textContent = estado.ingredientes;
        
        // Atualizar cores baseadas nos valores
        const saborElement = document.getElementById('sabor-value');
        const poderElement = document.getElementById('poder-value');
        
        if (estado.sabor < 0) {
            saborElement.className = 'color-red';
        } else if (estado.sabor > 20) {
            saborElement.className = 'color-green';
        } else {
            saborElement.className = 'color-cyan';
        }
        
        if (estado.poder < 0) {
            poderElement.className = 'color-red';
        } else if (estado.poder > 100) {
            poderElement.className = 'color-green';
        } else {
            poderElement.className = 'color-cyan';
        }
    }

    showRecipe() {
        if (!this.receitaAtual) {
            this.showError('Nenhuma receita carregada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>Receita Atual</h3>
            ${this.receitaAtual.gerarHtmlReceita()}
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    showIngredients() {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>Ingredientes Disponíveis</h3>
            ${this.alfabeto.criarTabelaIngredientes()}
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('info-modal').style.display = 'none';
    }

    showResult(success, message) {
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultArt = document.getElementById('result-art');

        if (success) {
            resultTitle.textContent = '🎉 Sucesso!';
            resultTitle.className = 'success';
            resultMessage.textContent = message;
            resultArt.textContent = Terminal.getCriandoPocoesArt();
        } else {
            resultTitle.textContent = '💀 Falhou!';
            resultTitle.className = 'failure';
            resultMessage.textContent = message;
            resultArt.textContent = Terminal.getPerdeArt();
        }

        this.showScreen('result-screen');
    }

    showMealyResult(resultado) {
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultArt = document.getElementById('result-art');

        if (resultado.sucesso) {
            if (resultado.motivo === 'poder_supremo') {
                resultTitle.textContent = '🌟 Poção Lendária!';
                resultTitle.className = 'success';
                resultMessage.innerHTML = `
                    <div>O corvo provador ficou tão impressionado que levou sua poção!</div>
                    <div><strong>Estatísticas:</strong></div>
                    <div>Sabor: ${resultado.sabor} | Poder: ${resultado.poder} | Ingredientes: ${resultado.ingredientes}</div>
                `;
                resultArt.textContent = Terminal.getCorvoPoderoso();
            } else {
                resultTitle.textContent = '✅ Poção Avaliada!';
                resultTitle.className = 'success';
                resultMessage.innerHTML = `
                    <div><strong>Avaliação do Corvo Provador:</strong></div>
                    <div>🍯 ${resultado.avaliacaoSabor.titulo}</div>
                    <div>⚡ ${resultado.avaliacaoPoder.titulo}</div>
                    <div><strong>Estatísticas:</strong></div>
                    <div>Sabor: ${resultado.sabor} | Poder: ${resultado.poder} | Ingredientes: ${resultado.ingredientes}</div>
                `;
                resultArt.textContent = Terminal.getCorvoArt();
            }
        } else {
            resultTitle.textContent = '💀 Poção Falhou!';
            resultTitle.className = 'failure';
            
            let motivo = '';
            switch (resultado.motivo) {
                case 'sabor_negativo':
                    motivo = 'O sabor ficou terrível demais!';
                    break;
                case 'muitos_ingredientes':
                    motivo = 'Muitos ingredientes misturados!';
                    break;
                default:
                    motivo = 'Falha na avaliação.';
            }
            
            resultMessage.innerHTML = `
                <div>${motivo}</div>
                <div><strong>Estatísticas:</strong></div>
                <div>Sabor: ${resultado.sabor} | Poder: ${resultado.poder} | Ingredientes: ${resultado.ingredientes}</div>
            `;
            resultArt.textContent = Terminal.getPerdeArt();
        }

        this.showScreen('result-screen');
    }

    newPotion() {
        // Reset do estado
        this.receitaAtual = null;
        this.automato = null;
        this.mealy = null;
        this.ingredientesAdicionados = [];
        this.primeiroIngrediente = true;

        // Limpar inputs
        document.getElementById('recipe-input').value = '';
        document.getElementById('ingredient-input').value = '';
        document.getElementById('mealy-ingredient-input').value = '';

        // Limpar logs
        Terminal.clear(document.getElementById('potion-log'));
        Terminal.clear(document.getElementById('mealy-log'));

        // Reset stats de Mealy
        document.getElementById('sabor-value').textContent = '0';
        document.getElementById('poder-value').textContent = '0';
        document.getElementById('ingredient-count').textContent = '0';

        // Esconder botões de finalizar
        document.getElementById('finish-potion-btn').style.display = 'none';
        document.getElementById('mealy-finish-btn').style.display = 'none';

        // Voltar ao menu
        this.showScreen('main-menu');
    }

    showError(message) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3 style="color: #e74c3c;">❌ Erro</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    exit() {
        stopBackgroundSound();
        soundEnd();
        
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultArt = document.getElementById('result-art');

        resultTitle.textContent = '👋 Até Logo!';
        resultTitle.className = 'success';
        resultMessage.textContent = 'Obrigado por usar o Alquimia Automática!';
        resultArt.textContent = Terminal.getFimArt();

        // Esconder botões
        document.getElementById('new-potion-btn').style.display = 'none';
        document.getElementById('back-menu-btn').style.display = 'none';

        this.showScreen('result-screen');
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AlquimiaApp();
});

// Exportar para uso global
window.AlquimiaApp = AlquimiaApp;
