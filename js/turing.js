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

const turingInput = document.getElementById('turing-ingredient-input');
const turingAddBtn = document.getElementById('turing-add-btn');
const turingFinishBtn = document.getElementById('turing-finish-btn');
const turingLog = document.getElementById('turing-log');
const turingScreen = document.getElementById('turing-machine');

let turingIngredients = [];

function updateTuringTape() {
    const tape = document.getElementById('turing-tape');
    if (!tape) return;
    tape.innerHTML = '';
    const inputString = turingIngredients.join('');
    const cells = inputString.split('');
    for (let i = 0; i < 3; i++) tape.appendChild(createCell('_'));
    cells.forEach((symbol, index) => {
        const cell = createCell(symbol);
        if (index === cells.length - 1) cell.classList.add('active');
        tape.appendChild(cell);
    });
    for (let i = 0; i < 5; i++) tape.appendChild(createCell('_'));
    const activeCell = tape.querySelector('.active');
    if (activeCell) activeCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}

function createCell(content) {
    const cell = document.createElement('div');
    cell.className = 'tape-cell';
    cell.textContent = content;
    return cell;
}

function animateIngredientAdded() {
    const tape = document.getElementById('turing-tape');
    if (!tape) return;
    const lastCell = [...tape.children].find(cell => cell.textContent !== '_' && !cell.classList.contains('active'));
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
            updateTuringTape();
            setTimeout(() => animateIngredientAdded(), 100);
            if (turingIngredients.length >= 3) turingFinishBtn.style.display = 'inline-block';
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
        turingLog.innerHTML += result === 'ACCEPT'
            ? `<div class='log-entry success'>✅ Bolo criado com sucesso!</div>`
            : `<div class='log-entry error'>❌ Erro: ingredientes inválidos.</div>`;
        turingIngredients = [];
        turingFinishBtn.style.display = 'none';
        setTimeout(() => updateTuringTape(), 2000);
    });
}

if (turingScreen) {
    new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && m.attributeName === 'class') {
                if (m.target.classList.contains('active')) setTimeout(() => updateTuringTape(), 100);
            }
        }
    }).observe(turingScreen, { attributes: true, attributeFilter: ['class'] });
}

function showTuringRecipe() {
    const modal = document.getElementById('info-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3>Máquina de Turing - Receita da Poção</h3>
        <div class="recipe-display">
            <div class="state"><div class="state-name">Estado: I</div>
                <div class="transition">Entrada: <span class="symbol">f</span> --&gt; <span class="next">S1</span></div>
            </div>
            <div class="state"><div class="state-name">Estado: S1</div>
                <div class="transition">Entrada: <span class="symbol">o</span> --&gt; <span class="next">S2</span></div>
                <div class="transition">Entrada: <span class="symbol">a</span>, <span class="symbol">l</span> --&gt; <span class="next">S1</span></div>
                <div class="transition">Entrada: <span class="symbol">e</span> --&gt; <span class="next">CE</span></div>
                <div class="transition">Entrada: <span class="symbol">c</span> --&gt; <span class="next">C</span></div>
            </div>
            <div class="state"><div class="state-name">Estado: S2</div>
                <div class="transition">Entrada: <span class="symbol">a</span>, <span class="symbol">l</span> --&gt; <span class="next">S2</span></div>
                <div class="transition">Entrada: <span class="symbol">e</span> --&gt; <span class="next">CE</span></div>
                <div class="transition">Entrada: <span class="symbol">c</span> --&gt; <span class="next">C</span></div>
                <div class="transition">Entrada: <span class="symbol">_</span> --&gt; <span class="next">ACCEPT</span></div>
            </div>
            <div class="state"><div class="state-name">Estado: CE</div>
                <div class="transition">Entrada: <span class="symbol">c</span> --&gt; <span class="next">REJECT</span></div>
                <div class="transition">Entrada: <span class="symbol">a</span>, <span class="symbol">l</span> --&gt; <span class="next">CE</span></div>
            </div>
            <div class="state"><div class="state-name">Estado: C</div>
                <div class="transition">Entrada: <span class="symbol">e</span> --&gt; <span class="next">REJECT</span></div>
                <div class="transition">Entrada: <span class="symbol">_</span> --&gt; <span class="next">ACCEPT</span></div>
                <div class="transition">Entrada: <span class="symbol">a</span>, <span class="symbol">l</span> --&gt; <span class="next">C</span></div>
            </div>
        </div>`;
    modal.style.display = 'block';
}

function showAlfabeto() {
    const modal = document.getElementById('info-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3>Alfabeto dos Ingredientes</h3>
        <table class="ingredient-table">
            <thead><tr><th>Símbolo</th><th>Ingrediente</th></tr></thead>
            <tbody>
                <tr><td>f</td><td>farinha</td></tr>
                <tr><td>o</td><td>ovos</td></tr>
                <tr><td>a</td><td>açúcar</td></tr>
                <tr><td>l</td><td>leite</td></tr>
                <tr><td>e</td><td>fermento</td></tr>
                <tr><td>c</td><td>chocolate</td></tr>
            </tbody>
        </table>`;
    modal.style.display = 'block';
}

document.getElementById('view-turing-file-btn')?.addEventListener('click', showTuringRecipe);
document.getElementById('view-alfabeto-btn')?.addEventListener('click', showAlfabeto);
