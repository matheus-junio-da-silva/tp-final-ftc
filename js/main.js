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
mor: mortífera`;

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
            this.mealy.run(this.alfabeto); // Inicializar a máquina
            this.resetMealyScreen();
            this.updateMealyLog(); // Atualizar log com histórico inicial
            this.updateMealyStats(); // Atualizar estatísticas iniciais
            this.showScreen('mealy-machine');
        });

        document.getElementById('moore-btn')?.addEventListener('click', () => {
            this.moore = new Moore();
            this.moore.run(this.alfabeto); // Inicializar a máquina
            this.resetMooreScreen();
            this.updateMooreLog(); // Atualizar log com histórico inicial
            this.updateMooreStats(); // Atualizar estatísticas iniciais
            this.showScreen('moore-machine');
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

        document.getElementById('view-mealy-recipes-btn')?.addEventListener('click', () => {
            this.showMealyRecipes();
        });

        // Máquina de Moore
        document.getElementById('moore-add-btn')?.addEventListener('click', () => {
            this.addMooreIngredient();
        });

        document.getElementById('moore-finish-btn')?.addEventListener('click', () => {
            this.finishMooreSequence();
        });

        // Botões de informação da Máquina de Moore
        document.getElementById('view-moore-machine-btn')?.addEventListener('click', () => {
            this.showMooreMachineInfo();
        });

        document.getElementById('view-moore-effects-btn')?.addEventListener('click', () => {
            this.showMooreEffects();
        });

        document.getElementById('view-moore-alphabet-btn')?.addEventListener('click', () => {
            this.showMooreAlphabet();
        });

        document.getElementById('view-moore-recipes-btn')?.addEventListener('click', () => {
            this.showMooreRecipes();
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

        document.getElementById('moore-ingredient-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addMooreIngredient();
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

        if (!this.mealy) {
            this.showError('Máquina de Mealy não inicializada.');
            return;
        }

        if (!this.alfabeto) {
            this.showError('Alfabeto não carregado.');
            return;
        }

        try {
            const sucesso = this.mealy.adicionarIngrediente(ingredient, this.alfabeto);
            
            if (sucesso) {
                // Tocar som de ingrediente (se disponível)
                if (typeof soundAddIngrediente === 'function') {
                    soundAddIngrediente();
                }
                
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
                // Tocar som de erro (se disponível)
                if (typeof soundGameOver === 'function') {
                    soundGameOver();
                }
            }
        } catch (error) {
            console.error('Erro ao adicionar ingrediente:', error);
            this.showError('Erro ao processar ingrediente: ' + error.message);
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

        // Mostrar a tela de resultado
        this.showScreen('result');
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

    showMealyRecipes() {
        if (!this.mealy) {
            this.showError('Máquina de Mealy não inicializada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>📜 Receitas Sugeridas para o Oráculo Místico</h3>
            <p>Experimente estas combinações estratégicas de ingredientes:</p>
            
            <div class="recipe-section">
                <h4>🌟 Receita da Poção Lendária</h4>
                <div class="recipe-content">
                    <p><strong>Objetivo:</strong> Alcançar poder ≥ 400 para que o oráculo absorva a poção</p>
                    <p><strong>Sequência:</strong> <code>biz → lol → omg → biz</code></p>
                    <p><strong>Estados:</strong> q0 → q_poderoso → q_poderoso → q_poderoso → q_poderoso</p>
                    <p><strong>Resultado esperado:</strong> Sabor: 0, Poder: 260 (precisa de mais ingredientes)</p>
                    <p><strong>Alternativa:</strong> <code>biz → lol → omg → biz → lol</code> (Poder: 360)</p>
                </div>
            </div>

            <div class="recipe-section">
                <h4>🍯 Receita da Poção Saborosa</h4>
                <div class="recipe-content">
                    <p><strong>Objetivo:</strong> Maximizar sabor mantendo poder moderado</p>
                    <p><strong>Sequência:</strong> <code>pip → bur → p → pix</code></p>
                    <p><strong>Estados:</strong> q0 → q_saboroso → q_saboroso → q_saboroso → q_saboroso</p>
                    <p><strong>Resultado esperado:</strong> Sabor: 32, Poder: 5</p>
                    <p><strong>Avaliação:</strong> "Obra Prima Culinária"</p>
                </div>
            </div>

            <div class="recipe-section">
                <h4>⚡ Receita da Poção Equilibrada</h4>
                <div class="recipe-content">
                    <p><strong>Objetivo:</strong> Balancear sabor e poder</p>
                    <p><strong>Sequência:</strong> <code>biz → pip → bur → sos</code></p>
                    <p><strong>Estados:</strong> q0 → q_poderoso → q_saboroso → q_saboroso → q_mortal</p>
                    <p><strong>Resultado esperado:</strong> Sabor: 19, Poder: 120</p>
                    <p><strong>Avaliação:</strong> Boa no sabor, Extremamente Poderosa</p>
                </div>
            </div>

            <div class="recipe-section">
                <h4>🧪 Receita Experimental</h4>
                <div class="recipe-content">
                    <p><strong>Objetivo:</strong> Testar diferentes transições de estado</p>
                    <p><strong>Sequência:</strong> <code>nho → a → o → p</code></p>
                    <p><strong>Estados:</strong> q0 → q_neutro → q_neutro → q_neutro → q_saboroso</p>
                    <p><strong>Resultado esperado:</strong> Sabor: 10, Poder: 2</p>
                    <p><strong>Avaliação:</strong> Poção Sem Graça (mas segura!)</p>
                </div>
            </div>

            <div class="recipe-section danger">
                <h4>💀 Receita Proibida (Não recomendada!)</h4>
                <div class="recipe-content">
                    <p><strong>Aviso:</strong> Esta receita resulta em falha!</p>
                    <p><strong>Sequência:</strong> <code>qualquer ingrediente → pum</code></p>
                    <p><strong>Estado final:</strong> q_ruim</p>
                    <p><strong>Resultado:</strong> Sabor: -100 (Falha automática)</p>
                    <p><strong>Motivo:</strong> Sabor negativo é rejeitado pelo oráculo</p>
                </div>
            </div>

            <div class="tips-section">
                <h4>💡 Dicas Estratégicas:</h4>
                <ul>
                    <li><strong>Ingredientes Poderosos:</strong> biz (+100 poder), lol (+40 poder), omg (+20 poder)</li>
                    <li><strong>Ingredientes Saborosos:</strong> pip (+12 sabor), bur (+5 sabor e poder)</li>
                    <li><strong>Evite pum:</strong> Causa -100 sabor (falha automática)</li>
                    <li><strong>Máximo 10 ingredientes:</strong> Mais que isso = "muito misturado"</li>
                    <li><strong>Para poção lendária:</strong> Foque em ingredientes poderosos</li>
                    <li><strong>Estados importam:</strong> Observe as transições para entender o comportamento</li>
                </ul>
            </div>
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    // Funções para a Máquina de Moore
    addMooreIngredient() {
        const input = document.getElementById('moore-ingredient-input');
        const ingredient = input.value.trim().toLowerCase();

        if (!ingredient) {
            this.showError('Por favor, insira um ingrediente.');
            return;
        }

        if (!this.moore) {
            this.showError('Máquina de Moore não inicializada.');
            return;
        }

        if (!this.alfabeto) {
            this.showError('Alfabeto não carregado.');
            return;
        }

        try {
            const sucesso = this.moore.adicionarIngrediente(ingredient, this.alfabeto);
            
            if (sucesso) {
                // Tocar som de ingrediente (se disponível)
                if (typeof soundAddIngrediente === 'function') {
                    soundAddIngrediente();
                }
                
                // Atualizar visual do caldeirão
                this.updateMooreCauldronVisual();
                
                // Atualizar estatísticas
                this.updateMooreStats();
                
                // Animar stats que mudaram
                this.animateUpdatedStats();
                
                // Atualizar log
                this.updateMooreLog();
                
                // Limpar input
                input.value = '';
                
                // Atualizar interface
                if (this.moore.primeiro) {
                    this.moore.primeiro = false;
                    document.getElementById('moore-ingredient-label').textContent = 'Símbolo do ingrediente:';
                    document.getElementById('moore-finish-btn').style.display = 'inline-block';
                }

            } else {
                soundGameOver();
            }

        } catch (error) {
            console.error('Erro ao adicionar ingrediente na Moore:', error);
            this.showError('Erro ao processar ingrediente. Verifique o console.');
        }
    }

    async finishMooreSequence() {
        const resultado = this.moore.avaliarSequencia();
        
        // Atualizar log final
        this.updateMooreLog();
        
        // Mostrar animação do caldeirão
        await this.showMooreCauldronAnimation(resultado);
        
        // Mostrar resultado
        setTimeout(() => {
            this.showMooreResult(resultado);
        }, 2000);
    }

    async showMooreCauldronAnimation(resultado) {
        const cauldron = document.getElementById('moore-cauldron');
        const output = document.getElementById('moore-output');

        if (!cauldron || !output) return;

        // Animação de avaliação
        for (let i = 0; i < 4; i++) {
            output.textContent = `Analisando sequência${'...'.substring(0, i + 1)}`;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Som baseado no resultado
        if (resultado.includes('Completa')) {
            soundOraculoWin();
        } else {
            soundOraculo();
        }

        // Resultado da avaliação
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const estado = this.moore.obterEstado();
        output.textContent = this.moore.obterSaidaEstado(this.moore.estadoAtual);
        
        // Animação de conclusão
        cauldron.classList.add('moore-ingredient-added');
        setTimeout(() => {
            cauldron.classList.remove('moore-ingredient-added');
        }, 2000);
    }

    showMooreResult(resultado) {
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultArt = document.getElementById('result-art');

        if (resultado.includes('Completa')) {
            resultTitle.textContent = '🏆 Sequência Perfeita!';
            resultTitle.className = 'success';
            resultMessage.textContent = 'Você completou a sequência da Máquina de Moore com perfeição!';
            resultArt.textContent = Terminal.getSucessoArt();
            soundPotionCreated();
        } else {
            resultTitle.textContent = '⚠️ Sequência Incompleta';
            resultTitle.className = 'warning';
            resultMessage.textContent = `${resultado}. Continue adicionando ingredientes para completar a sequência.`;
            resultArt.textContent = Terminal.getProcessandoArt();
            // Não mostrar tela de resultado, permitir continuar
            return;
        }

        // Mostrar botões apropriados
        document.getElementById('new-potion-btn').style.display = 'inline-block';
        document.getElementById('back-menu-btn').style.display = 'inline-block';

        this.showScreen('result');
    }

    updateMooreCauldronVisual() {
        const cauldron = document.getElementById('moore-cauldron');
        const cauldronContent = document.getElementById('moore-cauldron-content');
        const bubbles = document.getElementById('moore-bubbles');
        const output = document.getElementById('moore-output');

        if (!cauldron || !cauldronContent || !bubbles || !output) return;

        // Atualizar saída baseada no estado atual
        const saida = this.moore.obterSaidaEstado(this.moore.estadoAtual);
        output.textContent = saida;

        // Adicionar efeito visual
        cauldron.classList.add('moore-ingredient-added');
        bubbles.classList.add('active');

        // Definir cor baseada no progresso
        const progresso = this.moore.progresso;
        const cores = [
            '#8e44ad', '#9b59b6', '#af7ac5', '#bb8fce', '#c39bd3',
            '#d7bde2', '#e8daef', '#f4ecf7', '#fdeaa7', '#f9e79f',
            '#f7dc6f', '#f4d03f', '#f1c40f', '#f39c12', '#e67e22'
        ];
        
        if (progresso < cores.length) {
            cauldronContent.style.background = `linear-gradient(135deg, ${cores[progresso]}, ${cores[Math.min(progresso + 1, cores.length - 1)]})`;
        }

        // Remover classe de animação após completar
        setTimeout(() => {
            cauldron.classList.remove('moore-ingredient-added');
            bubbles.classList.remove('active');
        }, 2000);
    }

    updateMooreLog() {
        const log = document.getElementById('moore-log');
        if (!log) return;

        Terminal.clear(log);
        
        // Mostrar histórico da máquina de Moore
        const historico = this.moore.obterHistorico();
        historico.forEach(entrada => {
            Terminal.log(log, entrada.mensagem, entrada.tipo);
        });
    }

    updateMooreStats() {
        const estado = this.moore.obterEstado();
        
        // Atualizar valores nas estatísticas
        const stateValue = document.getElementById('moore-state-value');
        const expectedValue = document.getElementById('moore-expected-value');
        const ingredientCount = document.getElementById('moore-ingredient-count');
        const progressValue = document.getElementById('moore-progress');

        if (stateValue) stateValue.textContent = estado.estado;
        if (expectedValue) expectedValue.textContent = estado.ingredienteEsperado;
        if (ingredientCount) ingredientCount.textContent = estado.ingredientesUsados;
        if (progressValue) progressValue.textContent = `${estado.progresso}/${estado.total}`;

        // Atualizar painel de estado
        const statePanel = document.getElementById('moore-state-panel');
        if (statePanel) {
            const saida = this.moore.obterSaidaEstado(estado.estado);
            statePanel.innerHTML = `
                <h4>Estado da Máquina de Moore</h4>
                <p><strong>Estado Atual:</strong> ${estado.estado}</p>
                <p><strong>Saída:</strong> ${saida}</p>
                <p><strong>Progresso:</strong> ${estado.progresso}/${estado.total}</p>
            `;
        }

        // Atualizar painel de receitas
        const recipesPanel = document.getElementById('moore-recipes-panel');
        if (recipesPanel) {
            const sequencia = this.moore.getSequencia();
            let html = '<h4>Sequência da Receita</h4><ul>';
            
            sequencia.forEach((ingrediente, index) => {
                const status = index < estado.progresso ? '✅' : 
                              index === estado.progresso ? '👉' : '⏳';
                const className = index < estado.progresso ? 'completed' : 
                                 index === estado.progresso ? 'current-step' : '';
                html += `<li class="${className}">${status} ${index + 1}. ${ingrediente}</li>`;
            });
            
            html += '</ul>';
            recipesPanel.innerHTML = html;
        }
    }

    // Funções para mostrar informações da Máquina de Moore
    showMooreMachineInfo() {
        if (!this.moore) {
            this.showError('Máquina de Moore não inicializada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>🔮 Informações da Máquina de Moore</h3>
            ${this.moore.criarTabelaMaquina()}
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    showMooreEffects() {
        if (!this.moore) {
            this.showError('Máquina de Moore não inicializada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>✨ Efeitos dos Estados da Máquina de Moore</h3>
            <p>Na Máquina de Moore, cada estado produz uma saída específica:</p>
            
            <div class="effects-grid">
                <div class="effect-item">
                    <h4>S0 - Estado Inicial</h4>
                    <p>⚗️ Caldeirão vazio - Aguardando primeiro ingrediente</p>
                </div>
                
                <div class="effect-item">
                    <h4>S1-S5 - Estados Iniciais</h4>
                    <p>🌫️ Efeitos básicos: fumaça, brilho, bolhas, chamas, vapor</p>
                </div>
                
                <div class="effect-item">
                    <h4>S6-S10 - Estados Intermediários</h4>
                    <p>🌈 Efeitos mágicos: arco-íris, faíscas, vapor, páginas místicas, forma ovóide</p>
                </div>
                
                <div class="effect-item">
                    <h4>S11-S13 - Estados Avançados</h4>
                    <p>🌹 Efeitos refinados: pétalas, água cristalina, lágrima cintilante</p>
                </div>
                
                <div class="effect-item">
                    <h4>S14 - Estado Final</h4>
                    <p>✨ POÇÃO MÁGICA COMPLETADA! Luz dourada irradia!</p>
                </div>
            </div>
            
            <div class="machine-difference">
                <h4>🔄 Diferença da Máquina de Mealy:</h4>
                <p><strong>Moore:</strong> A saída depende apenas do estado atual</p>
                <p><strong>Mealy:</strong> A saída depende do estado atual E da entrada</p>
                <p>Isso significa que na Moore você sempre saberá o que esperar de cada estado!</p>
            </div>
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    showMooreAlphabet() {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>📚 Alfabeto da Máquina de Moore</h3>
            <p>A sequência específica que deve ser seguida:</p>
            
            <div class="alphabet-list">
                <div class="alphabet-section">
                    <h4>🎯 Sequência Obrigatória (14 passos):</h4>
                    <ol>
                        <li><strong>biz</strong> - biscoito de bruxa malvada</li>
                        <li><strong>bab</strong> - baba de camelo fedida</li>
                        <li><strong>nho</strong> - nhonho de gato persa</li>
                        <li><strong>pip</strong> - pipoca mágica explosiva</li>
                        <li><strong>pum</strong> - pum de dragão fedorento</li>
                        <li><strong>bur</strong> - buraco negro comestível</li>
                        <li><strong>pix</strong> - pixie dust colorido</li>
                        <li><strong>zap</strong> - zapzap elétrico infinito</li>
                        <li><strong>sos</strong> - sossega leão instantâneo</li>
                        <li><strong>lol</strong> - lolzinho mágico hilário</li>
                        <li><strong>p</strong> - pétalas</li>
                        <li><strong>a</strong> - água</li>
                        <li><strong>o</strong> - óleo</li>
                        <li><strong>omg</strong> - oh my god concentrado</li>
                    </ol>
                </div>
                
                <div class="alphabet-rules">
                    <h4>📋 Regras Importantes:</h4>
                    <ul>
                        <li>A sequência deve ser seguida <strong>exatamente</strong> nesta ordem</li>
                        <li>Qualquer ingrediente fora de ordem reinicia a sequência</li>
                        <li>Todos os 14 ingredientes devem ser adicionados para completar</li>
                        <li>A máquina de Moore é <strong>determinística</strong> e <strong>sequencial</strong></li>
                    </ul>
                </div>
            </div>
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    showMooreRecipes() {
        if (!this.moore) {
            this.showError('Máquina de Moore não inicializada.');
            return;
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>📜 Receita da Máquina de Moore</h3>
            <p>Diferente da Máquina de Mealy, a Moore tem apenas UMA receita válida:</p>
            
            <div class="recipe-section">
                <h4>🔮 A Única Receita Válida</h4>
                <div class="recipe-content">
                    <p><strong>Sequência Completa:</strong></p>
                    <p><code>biz → bab → nho → pip → pum → bur → pix → zap → sos → lol → p → a → o → omg</code></p>
                    <p><strong>Estados percorridos:</strong> S0 → S1 → S2 → ... → S14</p>
                    <p><strong>Resultado:</strong> Poção Mágica Completa ✨</p>
                </div>
            </div>

            <div class="recipe-section warning">
                <h4>⚠️ Tentativas Alternativas</h4>
                <div class="recipe-content">
                    <p><strong>Qualquer desvio da sequência:</strong></p>
                    <p>Estado atual → S0 (Reset completo)</p>
                    <p><strong>Exemplo de erro:</strong> biz → pip (deveria ser bab)</p>
                    <p><strong>Resultado:</strong> Explosão! Reinicio da sequência</p>
                </div>
            </div>

            <div class="tips-section">
                <h4>💡 Estratégia Recomendada:</h4>
                <ul>
                    <li><strong>Memorize a sequência:</strong> Anote os 14 passos</li>
                    <li><strong>Vá devagar:</strong> Cada erro requer recomeçar</li>
                    <li><strong>Use o painel de receitas:</strong> Mostra o próximo ingrediente</li>
                    <li><strong>Observe as transições:</strong> Cada estado tem uma saída única</li>
                    <li><strong>Seja paciente:</strong> A Moore recompensa a precisão!</li>
                </ul>
            </div>
        `;
        
        document.getElementById('info-modal').style.display = 'block';
    }

    resetMooreScreen() {
        // Limpar campos de entrada da Máquina de Moore
        const mooreInput = document.getElementById('moore-ingredient-input');
        if (mooreInput) {
            mooreInput.value = '';
        }

        // Limpar log da Máquina de Moore
        const mooreLog = document.getElementById('moore-log');
        if (mooreLog) {
            if (typeof Terminal !== 'undefined') {
                Terminal.clear(mooreLog);
            } else {
                mooreLog.innerHTML = '';
            }
        }

        // Resetar visual do caldeirão
        const cauldronContent = document.getElementById('moore-cauldron-content');
        if (cauldronContent) {
            cauldronContent.style.background = 'linear-gradient(135deg, #8e44ad, #9b59b6)';
        }

        // Limpar painel de estado
        const statePanel = document.getElementById('moore-state-panel');
        if (statePanel) {
            statePanel.innerHTML = '<h4>Estado da Máquina de Moore</h4><p>Aguardando inicialização...</p>';
        }

        // Limpar painel de receitas
        const recipesPanel = document.getElementById('moore-recipes-panel');
        if (recipesPanel) {
            recipesPanel.innerHTML = '<h4>Sequência da Receita</h4><p>Inicie a máquina para ver a sequência...</p>';
        }
    }

    resetMealyScreen() {
        // Limpar campos de entrada da Máquina de Mealy
        const mealyInput = document.getElementById('mealy-ingredient-input');
        if (mealyInput) {
            mealyInput.value = '';
        }

        // Limpar log da Máquina de Mealy
        const mealyLog = document.getElementById('mealy-log');
        if (mealyLog) {
            if (typeof Terminal !== 'undefined') {
                Terminal.clear(mealyLog);
            } else {
                mealyLog.innerHTML = '';
            }
        }

        // Limpar painel de estado
        const statePanel = document.getElementById('mealy-state-panel');
        if (statePanel) {
            statePanel.innerHTML = '<h4>Estado Atual: Aguardando inicialização...</h4>';
        }

        // Limpar painel de receitas
        const recipesPanel = document.getElementById('mealy-recipes-panel');
        if (recipesPanel) {
            recipesPanel.innerHTML = '<h4>Receitas Sugeridas</h4><p>Inicie a máquina para ver receitas...</p>';
        }
    }

}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AlquimiaApp();
});

// Exportar para uso global
window.AlquimiaApp = AlquimiaApp;
