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
        this.dadosIngredientes = `biz : biscoito de bruxa malvada
bab : baba de camelo fedida
nho : nhonho de gato persa
pip : pipoca magica explosiva
pum : pum de dragao fedorento
bur : buraco negro comestivel
pix : pixie dust colorido
zap : zapzap eletrico infinito
sos : sossega leao instantaneo
lol : lolzinho magico hilario
p   : petalas
a   : agua
o   : oleo
omg : oh my god concentrado`;

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
            this.resetMealyScreen();
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

        // Botões de informação da Máquina de Mealy
        document.getElementById('view-mealy-machine-btn')?.addEventListener('click', () => {
            this.showMealyMachineInfo();
        });

        document.getElementById('view-mealy-effects-btn')?.addEventListener('click', () => {
            this.showMealyEffects();
        });

        document.getElementById('view-mealy-alphabet-btn')?.addEventListener('click', () => {
            this.showMealyAlphabet();
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
            
            // Reset visual da poção
            this.resetPotionVisual();
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

    // Atualizar visual do oráculo quando ingrediente é adicionado no Mealy
    updateOraculoVisual(reacao) {
        const oraculo = document.getElementById('oraculo');
        const speechBubble = document.getElementById('speech-bubble');
        const speechText = document.getElementById('speech-text');
        
        if (!oraculo) return;

        // Remover classes antigas
        oraculo.classList.remove('ingredient-added', 'happy', 'angry', 'neutral');
        speechBubble?.classList.remove('ingredient-reaction');

        // Adicionar animação
        oraculo.classList.add('ingredient-added');

        // Definir humor baseado na reação
        if (reacao && reacao.sabor > 0 && reacao.poder > 0) {
            oraculo.classList.add('happy');
            if (speechText) speechText.textContent = '✨ Excelente ingrediente!';
        } else if (reacao && (reacao.sabor < 0 || reacao.poder < 0)) {
            oraculo.classList.add('angry');
            if (speechText) speechText.textContent = '💀 Ingrediente perigoso...';
        } else {
            oraculo.classList.add('neutral');
            if (speechText) speechText.textContent = '🤔 Interessante escolha...';
        }

        // Mostrar bolha de fala
        if (speechBubble) {
            speechBubble.style.display = 'block';
            speechBubble.classList.add('ingredient-reaction');
        }

        // Esconder bolha após um tempo
        setTimeout(() => {
            if (speechBubble) {
                speechBubble.style.display = 'none';
            }
            oraculo.classList.remove('ingredient-added', 'happy', 'angry', 'neutral');
        }, 3000);
    }

    // Resetar visual da poção para o estado inicial
    resetPotionVisual() {
        const cauldronContent = document.getElementById('cauldron-content');
        const cauldron = document.querySelector('.cauldron');
        const bubbles = document.querySelector('.bubbles');
        
        if (cauldronContent) {
            cauldronContent.className = 'cauldron-content';
        }
        if (cauldron) {
            cauldron.classList.remove('ingredient-glow');
        }
        if (bubbles) {
            bubbles.classList.remove('active');
        }
    }

    // Atualizar visual da poção quando ingrediente é adicionado
    updatePotionVisual() {
        const cauldronContent = document.getElementById('cauldron-content');
        const cauldron = document.querySelector('.cauldron');
        const bubbles = document.querySelector('.bubbles');
        
        if (!cauldronContent) return;

        // Remover classes antigas
        cauldronContent.className = 'cauldron-content';
        cauldron.classList.remove('ingredient-glow');
        bubbles.classList.remove('active');

        // Adicionar animação de ingrediente adicionado
        cauldronContent.classList.add('ingredient-added');
        cauldron.classList.add('ingredient-glow');
        bubbles.classList.add('active');

        // Definir cor baseada no número de ingredientes
        const numIngredientes = this.ingredientesAdicionados.length;
        
        if (numIngredientes <= 5) {
            cauldronContent.classList.add(`ingredient-${numIngredientes}`);
        } else {
            cauldronContent.classList.add('ingredient-many');
        }

        // Remover classe de animação após completar
        setTimeout(() => {
            cauldronContent.classList.remove('ingredient-added');
            cauldron.classList.remove('ingredient-glow');
            bubbles.classList.remove('active');
        }, 2000);
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
            
            // Atualizar visual da poção
            this.updatePotionVisual();
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

        // Atualizar visual da poção
        this.updatePotionVisual();

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
            
            // Obter a última reação para o oráculo
            const estado = this.mealy.obterEstado();
            const ultimaReacao = this.mealy.obterUltimaReacao ? this.mealy.obterUltimaReacao() : null;
            
            // Atualizar visual do oráculo
            this.updateOraculoVisual(ultimaReacao);
            
            // Atualizar estatísticas
            this.updateMealyStats();
            
            // Animar stats que mudaram
            this.animateUpdatedStats();
            
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
        
        // Mostrar animação do oráculo
        await this.showOraculoAnimation(resultado);
        
        // Mostrar resultado
        setTimeout(() => {
            this.showMealyResult(resultado);
        }, 2000);
    }

    async showOraculoAnimation(resultado) {
        const oraculo = document.getElementById('oraculo');
        const speechBubble = document.getElementById('speech-bubble');
        const speechText = document.getElementById('speech-text');

        if (!oraculo || !speechBubble || !speechText) return;

        // Animação de avaliação
        for (let i = 0; i < 4; i++) {
            speechText.textContent = `O oráculo místico está avaliando${'...'.substring(0, i + 1)}`;
            speechBubble.style.display = 'block';
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Som do oráculo
        let oraculoSound = null;
        if (resultado.motivo !== 'sabor_negativo') {
            oraculoSound = soundOraculo();
        }

        // Resultado da avaliação
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (resultado.sucesso) {
            if (resultado.motivo === 'poder_supremo') {
                speechText.innerHTML = '🌟 Esta poção é LENDÁRIA! O oráculo a absorverá em sua essência!';
                soundOraculoWin();
                if (oraculoSound) stopOraculoSound(oraculoSound);
            } else {
                speechText.innerHTML = '✨ Poção avaliada pela sabedoria ancestral! Veja os resultados abaixo.';
            }
        } else {
            speechText.innerHTML = '💀 O oráculo rejeita esta poção...';
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        speechBubble.style.display = 'none';
        
        if (oraculoSound && resultado.motivo !== 'poder_supremo') {
            stopOraculoSound(oraculoSound);
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

    // Animar stats que foram atualizadas
    animateUpdatedStats() {
        const stats = document.querySelectorAll('.stat');
        stats.forEach(stat => {
            stat.classList.remove('updated');
            setTimeout(() => {
                stat.classList.add('updated');
            }, 100);
        });
        
        // Remover animação após completar
        setTimeout(() => {
            stats.forEach(stat => {
                stat.classList.remove('updated');
            });
        }, 1000);
    }

    updateMealyStats() {
        const estado = this.mealy.obterEstado();
        
        document.getElementById('sabor-value').textContent = estado.sabor;
        document.getElementById('poder-value').textContent = estado.poder;
        document.getElementById('ingredient-count').textContent = estado.ingredientes;
        document.getElementById('estado-value').textContent = estado.estadoAtual;
        
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
                    <div>O oráculo místico absorveu sua poção em sua essência ancestral!</div>
                    <div><strong>Estatísticas:</strong></div>
                    <div>Sabor: ${resultado.sabor} | Poder: ${resultado.poder} | Ingredientes: ${resultado.ingredientes}</div>
                `;
                resultArt.textContent = Terminal.getOraculoPoderoso();
            } else {
                resultTitle.textContent = '✅ Poção Avaliada!';
                resultTitle.className = 'success';
                resultMessage.innerHTML = `
                    <div><strong>Avaliação do Oráculo Místico:</strong></div>
                    <div>🍯 ${resultado.avaliacaoSabor.titulo}</div>
                    <div>⚡ ${resultado.avaliacaoPoder.titulo}</div>
                    <div><strong>Estatísticas:</strong></div>
                    <div>Sabor: ${resultado.sabor} | Poder: ${resultado.poder} | Ingredientes: ${resultado.ingredientes}</div>
                `;
                resultArt.textContent = Terminal.getOraculoArt();
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

        // Reset visual da poção
        this.resetPotionVisual();

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
    }

    // Funções para mostrar informações da Máquina de Mealy
    showMealyMachineInfo() {
        if (!this.mealy) {
            this.showError('Máquina de Mealy não inicializada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>🔮 Informações da Máquina de Mealy</h3>
            ${this.mealy.criarTabelaMaquina()}
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    showMealyEffects() {
        if (!this.mealy) {
            this.showError('Máquina de Mealy não inicializada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>⚗️ Efeitos dos Ingredientes</h3>
            <p>Cada ingrediente produz efeitos específicos na poção:</p>
            ${this.mealy.criarTabelaEfeitos()}
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    showMealyAlphabet() {
        if (!this.mealy) {
            this.showError('Máquina de Mealy não inicializada.');
            return;
        }

        const alfabeto = this.mealy.obterAlfabeto();
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>🔤 Alfabeto da Máquina de Mealy</h3>
            <p>Símbolos aceitos pela máquina:</p>
            <div class="alphabet-grid">
                ${alfabeto.map(simbolo => `<span class="alphabet-symbol">${simbolo}</span>`).join('')}
            </div>
            <div style="margin-top: 20px;">
                <h4>📋 Ingredientes Correspondentes:</h4>
                ${this.alfabeto ? this.alfabeto.criarTabelaIngredientes() : '<p>Alfabeto de ingredientes não carregado.</p>'}
            </div>
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    // Resetar interface da máquina de Mealy
    resetMealyScreen() {
        // Resetar valores visuais
        document.getElementById('sabor-value').textContent = '0';
        document.getElementById('poder-value').textContent = '0';
        document.getElementById('ingredient-count').textContent = '0';
        document.getElementById('estado-value').textContent = 'q0';
        
        // Resetar input e label
        document.getElementById('mealy-ingredient-input').value = '';
        document.getElementById('mealy-ingredient-label').textContent = 'Insira o símbolo do primeiro ingrediente:';
        
        // Esconder botão de finalizar
        document.getElementById('mealy-finish-btn').style.display = 'none';
        
        // Limpar log
        const log = document.getElementById('mealy-log');
        if (log) {
            if (typeof Terminal !== 'undefined') {
                Terminal.clear(log);
            } else {
                log.innerHTML = '';
            }
        }
        
        // Resetar oráculo
        const oraculo = document.getElementById('oraculo');
        const speechBubble = document.getElementById('speech-bubble');
        
        if (oraculo) {
            oraculo.className = 'oraculo';
        }
        
        if (speechBubble) {
            speechBubble.style.display = 'none';
        }
        
        // Resetar cores das estatísticas
        document.getElementById('sabor-value').className = 'color-cyan';
        document.getElementById('poder-value').className = 'color-cyan';
    }

}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AlquimiaApp();
});

// Exportar para uso global
window.AlquimiaApp = AlquimiaApp;
