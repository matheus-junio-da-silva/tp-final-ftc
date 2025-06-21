class MoorePotionMachine {
    constructor() {
        this.state = 'S0';
        this.output = '⚗️ Caldeirão vazio';
        this.expectedIngredient = 'dan';
        this.sequence = [
            'dan', 'sap', 'olh', 'jub', 'gam',
            'alh', 'sal', 'cas', 'cob', 'ftc',
            'o', 'p', 'a', 'lst'
        ];
        this.log = [];
    }

    transition(ingredient) {
        const stateActions = {
            'S0': () => this._handleState(ingredient, 0, '⚗️ Caldeirão vazio'),
            'S1': () => this._handleState(ingredient, 1, '🌫️ Fumaça verde...'),
            'S2': () => this._handleState(ingredient, 2, '💫 Brilho fracasso'),
            'S3': () => this._handleState(ingredient, 3, '🌀 Bolhas azuis'),
            'S4': () => this._handleState(ingredient, 4, '🔥 Chamas suaves'),
            'S5': () => this._handleState(ingredient, 5, '💨 Vapor roxo'),
            'S6': () => this._handleState(ingredient, 6, '🌈 Arco-íris'),
            'S7': () => this._handleState(ingredient, 7, '⚡ Faíscas douradas'),
            'S8': () => this._handleState(ingredient, 8, '🌡️ Caldeirão fumegante'),
            'S9': () => this._handleState(ingredient, 9, '📖 Páginas viram sozinhas'),
            'S10': () => this._handleState(ingredient, 10, '🥚 Ovo pulsante'),
            'S11': () => this._handleState(ingredient, 11, '🌹 Pétalas flutuantes'),
            'S12': () => this._handleState(ingredient, 12, '💧 Água brilhante'),
            'S13': () => this._handleState(ingredient, 13, '😢 Lágrima cintilante'),
            'S14': () => {
                this.state = 'S14';
                this.output = '✨ POÇÃO FINALIZADA!';
            }
        };

        (stateActions[this.state] || (() => {
            this.state = 'S0';
            this.output = '❌ Estado inválido - Resetando';
        }))();

        this.log.push(`Ingrediente: ${ingredient} | Estado: ${this.state} | Saída: ${this.output}`);
        return this.output;
    }

    _handleState(input, stepIndex, stateOutput) {
        if (input === this.sequence[stepIndex]) {
            this.state = `S${stepIndex + 1}`;
            this.expectedIngredient = this.sequence[stepIndex + 1] || 'COMPLETA';
            this.output = stateOutput;
        } else {
            this.state = 'S0';
            this.expectedIngredient = this.sequence[0];
            this.output = '💥 EXPLOSÃO! Ingrediente errado!';
        }
    }

    getStatus() {
        return {
            state: this.state,
            output: this.output,
            nextIngredient: this.expectedIngredient
        };
    }

    getLog() {
        return this.log.join('<br>');
    }
}

const potionMachine = new MoorePotionMachine();

// Exibição no HTML

document.getElementById('moore-btn').addEventListener('click', () => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    createMooreScreen();
});

function createMooreScreen() {
    let container = document.createElement('div');
    container.id = 'moore-machine';
    container.classList.add('screen', 'active');

    container.innerHTML = `
        <div class="moore-container">
            <h2>Máquina de Moore - Criação de Poção</h2>
            <div class="ingredient-input">
                <label>Digite o próximo ingrediente:</label>
                <input type="text" id="moore-ingredient-input" maxlength="3" placeholder="Ex: dan">
                <button id="moore-add-btn" class="magic-button">Adicionar Ingrediente</button>
                <button id="moore-finish-btn" class="magic-button secondary">Finalizar Poção</button>
            </div>
            <div id="moore-output" class="potion-log"></div>
        </div>
    `;
    document.body.appendChild(container);

    document.getElementById('moore-add-btn').addEventListener('click', handleMooreIngredient);
    document.getElementById('moore-finish-btn').addEventListener('click', showMooreLog);
}

function handleMooreIngredient() {
    const input = document.getElementById('moore-ingredient-input').value.trim();
    if (input) {
        potionMachine.transition(input);
        const status = potionMachine.getStatus();
        document.getElementById('moore-output').innerHTML = `
            <strong>Estado:</strong> ${status.state}<br>
            <strong>Saída:</strong> ${status.output}<br>
            <strong>Próximo Ingrediente:</strong> ${status.nextIngredient}
        `;
        document.getElementById('moore-ingredient-input').value = '';
    }
}

function showMooreLog() {
    const log = potionMachine.getLog();
    alert('Log de execução:\n\n' + log.replace(/<br>/g, '\n'));
}
