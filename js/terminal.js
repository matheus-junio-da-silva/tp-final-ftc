class Terminal {
    // Função para colorir texto usando CSS classes
    static colorize(text, colorClass) {
        return `<span class="${colorClass}">${text}</span>`;
    }

    static red(text) {
        return Terminal.colorize(text, 'color-red');
    }

    static green(text) {
        return Terminal.colorize(text, 'color-green');
    }

    static yellow(text) {
        return Terminal.colorize(text, 'color-yellow');
    }

    static blue(text) {
        return Terminal.colorize(text, 'color-blue');
    }

    static magenta(text) {
        return Terminal.colorize(text, 'color-magenta');
    }

    static cyan(text) {
        return Terminal.colorize(text, 'color-cyan');
    }

    static white(text) {
        return Terminal.colorize(text, 'color-white');
    }

    static orange(text) {
        return Terminal.colorize(text, 'color-orange');
    }

    // Função para adicionar texto colorido a um elemento
    static appendColoredText(element, text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        element.appendChild(div);
    }

    // Função para limpar um elemento
    static clear(element) {
        element.innerHTML = '';
    }

    // Título ASCII art
    static getTitleArt() {
        return `ALQUIMIA AUTOMÁTICA
Simulador de Poções com Autômatos`;
    }

    static getMenuArt() {
        return `+------------------------------------------+
|  "Qual tipo de autômato deseja inserir?" |
|------------------------------------------|
|      1 - Automato Deterministico         |
|        2 - Máquina de Mealy              |
|              3 - Sair                    |
+------------------------------------------+`;
    }

    static getFimArt() {
        return `ACABOU
Por hoje!`;
    }

    static getPerdeArt() {
        return `FALHA
Você perdeu!`;
    }

    static getCriandoPocoesArt() {
        return `CRIANDO POÇÕES
Máquina Ativa`;
    }

    static getOraculoArt() {
        return `        ✦･ﾟ: *✦･ﾟ:*
      ╭─────────────╮
     │  ◉       ◉  │
     │      ◕      │
     ╰─────────────╯
    ✧･ﾟ: *✧･ﾟ:* ✧･ﾟ: *
        🔮 ORÁCULO 🔮
    ･ﾟ✧*:･ﾟ✧ ･ﾟ✧*:･ﾟ✧                   `;
    }

    static getOraculoPoderoso() {
        return `Oráculo Místico Poderoso ASCII Art`;
    }

    // Função para exibir arte ASCII colorida
    static displayArt(element, art, colorClass = 'color-cyan') {
        const pre = document.createElement('pre');
        pre.innerHTML = Terminal.colorize(art, colorClass);
        pre.style.fontSize = '0.7rem';
        pre.style.lineHeight = '1';
        pre.style.textAlign = 'center';
        element.appendChild(pre);
    }

    // Função para exibir mensagens de log
    static log(element, message, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = message;
        element.appendChild(logEntry);
        element.scrollTop = element.scrollHeight;
    }
}

// Exportar para uso global
window.Terminal = Terminal;
