class TuringMachine {
    constructor(tape, transitionFunction, initialState, finalStates, onStep) {
        this.tape = tape.split('');
        this.head = 0;
        this.state = initialState;
        this.finalStates = finalStates;
        this.transitionFunction = transitionFunction;
        this.onStep = onStep || (() => {});
    }

    step() {
        const symbol = this.tape[this.head] || '_';
        const key = `${this.state},${symbol}`;

        if (!(key in this.transitionFunction)) {
            this.state = 'REJECT';
            return;
        }

        const [newState, writeSymbol, direction] = this.transitionFunction[key];
        this.tape[this.head] = writeSymbol;
        this.state = newState;
        this.head += (direction === 'R' ? 1 : -1);

        this.onStep([...this.tape], this.head, this.state);
    }

    run() {
        while (!this.finalStates.includes(this.state) && this.state !== 'REJECT') {
            this.step();
        }
        return this.state === 'REJECT' ? 'REJECT' : 'ACCEPT';
    }
}

const turingInput = document.getElementById('turing-ingredient-input');
const turingAddBtn = document.getElementById('turing-add-btn');
const turingFinishBtn = document.getElementById('turing-finish-btn');
const turingLog = document.getElementById('turing-log');
const tapeDiv = document.getElementById('turing-tape');

let turingIngredients = [];

function updateTuringTapeView(tapeArr = [], head = 0) {
    if (!tapeDiv) return;
    tapeDiv.innerHTML = '';
    for (let i = 0; i < tapeArr.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'tape-cell';
        cell.textContent = tapeArr[i] || '_';
        if (i === head) cell.classList.add('active');
        tapeDiv.appendChild(cell);
    }
}

function animateIngredientAdded() {
    if (!tapeDiv) return;
    const lastCell = [...tapeDiv.children].find(cell => cell.textContent !== '_' && !cell.classList.contains('active'));
    if (lastCell) {
        lastCell.classList.add('ingredient-added');
        setTimeout(() => lastCell.classList.remove('ingredient-added'), 1000);
    }
}

if (turingAddBtn) {
    turingAddBtn.addEventListener('click', () => {
        const symbol = turingInput.value.trim().toLowerCase();
        if (symbol) {
            turingIngredients.push(symbol);
            turingLog.innerHTML += `<div class="log-entry info">Ingrediente adicionado: <strong>${symbol}</strong></div>`;
            turingInput.value = '';
            updateTuringTapeView(turingIngredients, -1);
            setTimeout(() => animateIngredientAdded(), 100);
            if (turingIngredients.length >= 3) turingFinishBtn.style.display = 'inline-block';
        }
    });
}



if (turingFinishBtn) {
    turingFinishBtn.addEventListener('click', () => {
        const inputString = turingIngredients.join('');
        const transitions = {
            // Início
            "I,p": ["BUSCA_A", "X", "R"],
            "I,X": ["I", "X", "R"],
            "I,Y": ["I", "Y", "R"],
            "I,Z": ["I", "Z", "R"],
            "I,_": ["CHECA_FIM", "_", "R"],
            "I,a": ["REJECT", "a", "R"],
            "I,o": ["REJECT", "o", "R"],

            // Busca 'a'
            "BUSCA_A,X": ["BUSCA_A", "X", "R"],
            "BUSCA_A,Y": ["BUSCA_A", "Y", "R"],
            "BUSCA_A,Z": ["BUSCA_A", "Z", "R"],
            "BUSCA_A,p": ["BUSCA_A", "p", "R"],
            "BUSCA_A,a": ["BUSCA_O", "Y", "R"],
            "BUSCA_A,o": ["REJECT", "o", "R"],
            "BUSCA_A,_": ["REJECT", "_", "R"],

            // Busca 'o'
            "BUSCA_O,X": ["BUSCA_O", "X", "R"],
            "BUSCA_O,Y": ["BUSCA_O", "Y", "R"],
            "BUSCA_O,Z": ["BUSCA_O", "Z", "R"],
            "BUSCA_O,a": ["BUSCA_O", "a", "R"],
            "BUSCA_O,o": ["VOLTA", "Z", "L"],
            "BUSCA_O,p": ["REJECT", "p", "R"],
            "BUSCA_O,_": ["REJECT", "_", "R"],

            // Volta ao início
            "VOLTA,X": ["VOLTA", "X", "L"],
            "VOLTA,Y": ["VOLTA", "Y", "L"],
            "VOLTA,Z": ["VOLTA", "Z", "L"],
            "VOLTA,a": ["VOLTA", "a", "L"],
            "VOLTA,o": ["VOLTA", "o", "L"],
            "VOLTA,p": ["VOLTA", "p", "L"],
            "VOLTA,_": ["PROC_P", "_", "R"],

            // Procura próximo p
            "PROC_P,X": ["PROC_P", "X", "R"],
            "PROC_P,Y": ["PROC_P", "Y", "R"],
            "PROC_P,Z": ["PROC_P", "Z", "R"],
            "PROC_P,a": ["PROC_P", "a", "R"],
            "PROC_P,o": ["PROC_P", "o", "R"],
            "PROC_P,p": ["BUSCA_A", "X", "R"],
            "PROC_P,_": ["VOLTA_VERIFICA", "_", "L"],

            // Volta para o início da fita
            "VOLTA_VERIFICA,X": ["VOLTA_VERIFICA", "X", "L"],
            "VOLTA_VERIFICA,Y": ["VOLTA_VERIFICA", "Y", "L"],
            "VOLTA_VERIFICA,Z": ["VOLTA_VERIFICA", "Z", "L"],
            "VOLTA_VERIFICA,_": ["VERIFICA_TUDO", "_", "R"],

            // Verifica se há p, a ou o não marcados
            "VERIFICA_TUDO,X": ["VERIFICA_TUDO", "X", "R"],
            "VERIFICA_TUDO,Y": ["VERIFICA_TUDO", "Y", "R"],
            "VERIFICA_TUDO,Z": ["VERIFICA_TUDO", "Z", "R"],
            "VERIFICA_TUDO,_": ["ACCEPT", "_", "R"],
            "VERIFICA_TUDO,p": ["REJECT", "p", "R"],
            "VERIFICA_TUDO,a": ["REJECT", "a", "R"],
            "VERIFICA_TUDO,o": ["REJECT", "o", "R"]
        };

        const tm = new TuringMachine(inputString, transitions, "I", ["ACCEPT"], updateTuringTapeView);
        const result = tm.run();

        turingLog.innerHTML += result === 'ACCEPT'
            ? `<div class='log-entry success'>✅ Receita aceita: padrão pⁿaⁿoⁿ correto!</div>`
            : `<div class='log-entry error'>❌ Receita rejeitada: verifique a ordem e quantidade de p, a, o.</div>`;

        turingIngredients = [];
        turingFinishBtn.style.display = 'none';
    });
}

document.getElementById('view-turing-file-btn')?.addEventListener('click', showTuringRecipe);

function showTuringRecipe() {
    const modal = document.getElementById('info-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3>Máquina de Turing - Reconhecendo pⁿaⁿoⁿ</h3>
        <pre style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">
Estado I:
Transições:
  Entrada: p → BUSCA_A
  Entrada: X → I
  Entrada: Y → I
  Entrada: Z → I
  Entrada: _ → CHECA_FIM
  Entrada: a → REJECT
  Entrada: o → REJECT

Estado BUSCA_A:
Transições:
  Entrada: a → BUSCA_O
  Entrada: X → BUSCA_A
  Entrada: Y → BUSCA_A
  Entrada: Z → BUSCA_A
  Entrada: p → BUSCA_A
  Entrada: _ → REJECT
  Entrada: o → REJECT

Estado BUSCA_O:
Transições:
  Entrada: o → VOLTA
  Entrada: X → BUSCA_O
  Entrada: Y → BUSCA_O
  Entrada: Z → BUSCA_O
  Entrada: a → BUSCA_O
  Entrada: _ → REJECT
  Entrada: p → REJECT

Estado VOLTA:
Transições:
  Entrada: qualquer símbolo → VOLTA
  Entrada: _ → PROC_P

Estado PROC_P:
Transições:
  Entrada: p → BUSCA_A
  Entrada: X → PROC_P
  Entrada: Y → PROC_P
  Entrada: Z → PROC_P
  Entrada: a → PROC_P
  Entrada: o → PROC_P
  Entrada: _ → VOLTA_VERIFICA

Estado VOLTA_VERIFICA:
Transições:
  Entrada: qualquer símbolo → VOLTA_VERIFICA
  Entrada: _ → VERIFICA_TUDO

Estado VERIFICA_TUDO:
Transições:
  Entrada: X → VERIFICA_TUDO
  Entrada: Y → VERIFICA_TUDO
  Entrada: Z → VERIFICA_TUDO
  Entrada: _ → ACCEPT
  Entrada: p → REJECT
  Entrada: a → REJECT
  Entrada: o → REJECT
        </pre>
    `;
    modal.style.display = 'block';
}



document.getElementById('view-alfabeto-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('info-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3>Alfabeto dos Ingredientes</h3>
        <table class="ingredient-table">
            <thead><tr><th>Símbolo</th><th>Ingrediente</th></tr></thead>
            <tbody>
                <tr><td>p</td><td>pétala</td></tr>
                <tr><td>a</td><td>água</td></tr>
                <tr><td>o</td><td>óleo</td></tr>
            </tbody>
        </table>`;
    modal.style.display = 'block';
});
