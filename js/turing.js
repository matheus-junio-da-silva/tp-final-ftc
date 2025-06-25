// js/turing.js

class TuringMachine {
    constructor(tape, transitionFunction, initialState, finalStates) {
        this.tape = tape.split('');
        this.head = 0;
        this.state = initialState;
        this.finalStates = finalStates;
        this.transitionFunction = transitionFunction;
        this.log = [];
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
    }

    run() {
        while (!this.finalStates.includes(this.state) && this.state !== 'REJECT') {
            this.step();
        }

        return this.state === 'REJECT' ? 'REJECT' : 'ACCEPT';
    }
}

// Integração com a interface da Máquina de Turing
const turingInput = document.getElementById('turing-ingredient-input');
const turingAddBtn = document.getElementById('turing-add-btn');
const turingFinishBtn = document.getElementById('turing-finish-btn');
const turingLog = document.getElementById('turing-log');
const turingScreen = document.getElementById('turing-machine');

let turingIngredients = [];

if (turingAddBtn) {
    turingAddBtn.addEventListener('click', () => {
        const symbol = turingInput.value.trim().toLowerCase();
        if (symbol) {
            turingIngredients.push(symbol);
            turingLog.innerHTML += `<div class="log-entry info">Ingrediente adicionado: <strong>${symbol}</strong></div>`;
            turingInput.value = '';
            if (turingIngredients.length >= 3) {
                turingFinishBtn.style.display = 'inline-block';
            }
        }
    });
}

if (turingFinishBtn) {
    turingFinishBtn.addEventListener('click', () => {
        const inputString = turingIngredients.join('');
        const transitions = {
            "I,f": ["S1", "f", "R"],
            "S1,o": ["S2", "o", "R"],
            "S1,a": ["S1", "a", "R"],
            "S1,l": ["S1", "l", "R"],
            "S1,e": ["CE", "e", "R"],
            "S1,c": ["C", "c", "R"],
            "S2,a": ["S2", "a", "R"],
            "S2,l": ["S2", "l", "R"],
            "S2,e": ["CE", "e", "R"],
            "S2,c": ["C", "c", "R"],
            "S2,_": ["ACCEPT", "_", "R"],
            "CE,c": ["REJECT", "c", "R"],
            "C,e": ["REJECT", "e", "R"],
            "C,_": ["ACCEPT", "_", "R"],
            "S1,_": ["REJECT", "_", "R"],
            "C,a": ["C", "a", "R"],
            "C,l": ["C", "l", "R"],
            "CE,a": ["CE", "a", "R"],
            "CE,l": ["CE", "l", "R"]
        };

        const tm = new TuringMachine(inputString, transitions, "I", ["ACCEPT"]);
        const result = tm.run();

        if (result === 'ACCEPT') {
            turingLog.innerHTML += `<div class='log-entry success'>✅ Bolo criado com sucesso!</div>`;
        } else {
            turingLog.innerHTML += `<div class='log-entry error'>❌ Erro: ingredientes inválidos.</div>`;
        }

        turingIngredients = [];
        turingFinishBtn.style.display = 'none';
    });
}

function fetchAndShowFile(url, title) {
    fetch(url)
        .then(res => res.text())
        .then(text => {
            const modal = document.getElementById('info-modal');
            const body = document.getElementById('modal-body');
            body.innerHTML = `<h3>${title}</h3><pre class="recipe-display">${text}</pre>`;
            modal.style.display = 'block';
        })
        .catch(err => {
            alert("Erro ao carregar o arquivo: " + err.message);
        });
}

// Botões
document.getElementById('view-turing-file-btn')?.addEventListener('click', () => {
    fetchAndShowFile('alfabeto_turing.txt', 'Máquina de Turing - Receita de Bolo');
});

document.getElementById('view-alfabeto-btn')?.addEventListener('click', () => {
    fetchAndShowFile('turing_receita.txt', 'Alfabeto dos Ingredientes');
});

