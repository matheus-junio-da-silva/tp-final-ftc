/**
 * Mealy functions - JavaScript equivalent of mealy.py
 * Handles Mealy machine functionality with crow evaluator
 */

// Realização dinâmica de uma máquina de Mealy
class Mealy {
    constructor() {
        this.descricoes = {};
        this.leMealy();
    }

    async run(sigma) {
        this.primeiro = true;
        this.cont = 0;
        this.poder = 0;
        this.sabor = 0;
        this.ingredientesUsados = [];
        this.historico = [];
        
        this.adicionarHistorico("🧙‍♂️ Iniciando avaliação com a Máquina de Mealy...", 'info');
        this.adicionarHistorico("🐦‍⬛ O corvo provador está pronto para avaliar sua poção!", 'info');
    }

    adicionarIngrediente(ingrediente, sigma) {
        if (!sigma.validaIngrediente(ingrediente)) {
            this.adicionarHistorico(`❌ Ingrediente "${ingrediente}" não reconhecido!`, 'error');
            return false;
        }

        if (!(ingrediente in this.descricoes)) {
            this.adicionarHistorico(`⚠️ Ingrediente "${ingrediente}" não tem efeitos definidos na máquina de Mealy!`, 'error');
            return false;
        }

        this.cont++;
        const efeitos = this.descricoes[ingrediente];
        const [descricao, sabor, poder] = efeitos;

        this.sabor += parseInt(sabor);
        this.poder += parseInt(poder);
        this.ingredientesUsados.push({
            simbolo: ingrediente,
            nome: sigma.descreveIngrediente(ingrediente),
            descricao: descricao,
            sabor: parseInt(sabor),
            poder: parseInt(poder)
        });

        this.adicionarHistorico(
            `🧪 Ingrediente ${this.cont}: "${ingrediente}" (${sigma.descreveIngrediente(ingrediente)})`,
            'info'
        );
        this.adicionarHistorico(`   💫 ${descricao}`, 'success');
        this.adicionarHistorico(`   📊 Sabor: ${sabor > 0 ? '+' : ''}${sabor}, Poder: ${poder > 0 ? '+' : ''}${poder}`, 'info');

        return true;
    }

    avaliarPocao() {
        this.adicionarHistorico("\n" + "=".repeat(50), 'info');
        this.adicionarHistorico("🐦‍⬛ O corvo provador vai avaliar sua poção...", 'info');
        
        // Verificações especiais primeiro
        if (this.sabor < 0) {
            this.adicionarHistorico("💀 O corvo desmaiou devido ao gosto terrível da poção!", 'error');
            return {
                sucesso: false,
                motivo: 'sabor_negativo',
                sabor: this.sabor,
                poder: this.poder,
                ingredientes: this.cont
            };
        }

        if (this.cont > 10) {
            this.adicionarHistorico("🗣️ O corvo gralhou, disse que a poção ficou muito misturada e não conseguiu provar direito", 'error');
            return {
                sucesso: false,
                motivo: 'muitos_ingredientes',
                sabor: this.sabor,
                poder: this.poder,
                ingredientes: this.cont
            };
        }

        if (this.poder >= 400) {
            this.adicionarHistorico("🌟 A poção é muito poderosa! O poder do corvo provador ultrapassa seu próprio poder!", 'success');
            this.adicionarHistorico("🦅 Ele pega o caldeirão com as próprias garras e sai voando com ele pela janela!!!", 'success');
            return {
                sucesso: true,
                motivo: 'poder_supremo',
                sabor: this.sabor,
                poder: this.poder,
                ingredientes: this.cont
            };
        }

        // Avaliação normal
        const avaliacaoSabor = this.avaliarSabor(this.sabor);
        const avaliacaoPoder = this.avaliarPoder(this.poder);

        return {
            sucesso: true,
            motivo: 'avaliacao_normal',
            sabor: this.sabor,
            poder: this.poder,
            ingredientes: this.cont,
            avaliacaoSabor: avaliacaoSabor,
            avaliacaoPoder: avaliacaoPoder
        };
    }

    avaliarSabor(sabor) {
        let avaliacao = {};
        
        this.adicionarHistorico("\n🍯 Avaliando o sabor da poção...", 'info');
        
        if (sabor === 0) {
            avaliacao = {
                emoji: "💧",
                titulo: "Poção Aguada",
                descricao: "O corvo provador disse que sua poção ficou aguada. A poção carece de sabor.",
                classe: 'azul'
            };
        } else if (sabor < 10) {
            avaliacao = {
                emoji: "😐",
                titulo: "Poção Sem Graça",
                descricao: "O corvo provador disse que sua poção ficou meio sem graça. Está faltando um pouco mais de tempero.",
                classe: 'branco'
            };
        } else if (sabor < 20) {
            avaliacao = {
                emoji: "👍",
                titulo: "Poção Boa",
                descricao: "O corvo provador disse que sua poção ficou muito boa. O sabor está agradável.",
                classe: 'verde'
            };
        } else if (sabor < 40) {
            avaliacao = {
                emoji: "🌟",
                titulo: "Poção Espetacular",
                descricao: "O corvo provador disse que sua poção ficou espetacular. Um verdadeiro deleite!",
                classe: 'azul'
            };
        } else {
            avaliacao = {
                emoji: "👨‍🍳",
                titulo: "Obra Prima Culinária",
                descricao: "O corvo provador disse que você deveria largar a bruxaria e virar chefe de cozinha. A poção está fantástica!",
                classe: 'vermelho'
            };
        }

        this.adicionarHistorico(`${avaliacao.emoji} ${avaliacao.titulo}: ${avaliacao.descricao}`, 'success');
        return avaliacao;
    }

    avaliarPoder(poder) {
        let avaliacao = {};
        
        this.adicionarHistorico("\n⚡ Avaliando o poder da poção...", 'info');
        
        if (poder < 0) {
            avaliacao = {
                emoji: "😵",
                titulo: "Poção Enfraquecedora",
                descricao: "O corvo provador desmaiou de fraqueza. A poção é extremamente fraca.",
                classe: 'vermelho'
            };
        } else if (poder === 0) {
            avaliacao = {
                emoji: "🌀",
                titulo: "Poção Inerte",
                descricao: "O corvo provador disse que sua poção não tem poder algum.",
                classe: 'amarelo'
            };
        } else if (poder < 50) {
            avaliacao = {
                emoji: "🔮",
                titulo: "Poção Mediana",
                descricao: "O corvo provador disse que sua poção tem um poder mediano.",
                classe: 'laranja'
            };
        } else if (poder < 100) {
            avaliacao = {
                emoji: "⚡",
                titulo: "Poção Poderosa",
                descricao: "O corvo provador disse que sua poção é bastante poderosa.",
                classe: 'verde'
            };
        } else if (poder < 200) {
            avaliacao = {
                emoji: "💪",
                titulo: "Poção Extremamente Poderosa",
                descricao: "O corvo provador disse que sua poção é extremamente poderosa!!!",
                classe: 'verde'
            };
        } else {
            avaliacao = {
                emoji: "🌟",
                titulo: "Poção Lendária",
                descricao: "O corvo provador está maravilhado com o poder da poção e a considera lendária!",
                classe: 'verde'
            };
        }

        this.adicionarHistorico(`${avaliacao.emoji} ${avaliacao.titulo}: ${avaliacao.descricao}`, 'success');
        return avaliacao;
    }

    leMealy() {
        // Dados da máquina de Mealy (convertidos do arquivo mealy.txt)
        const conteudoMealy = `biz : um dos artefatos mais poderosos do seu inventario foi colocado na pocao. O nivel de poder da pocao cresceu muito!!! |0|100|
bab : a pocao passa a assobiar quando tem frio. A pocao ficou um pouquinho mais gostosa e poderosa |2|2|
nho : voce tem um leve vislumbre da africa na superficie da pocao que rapidamente desaparece. O sabor da pocao quase nao aumenta |0|2|
pip : a pocao ficou levemente mais doce. O sabor da pocao aumentou significativamente |12|0|
pum : a pocao fica intragavel e terrivelmente mal cheirosa |-100|0|
bur : a pocao exala um cheiro de tempeiro delicioso. O sabor e o poder da pocao aumentam |5|5|
pix : a pocao fica mais bem temperado. O sabor da pocao aumenta |5|0|
zap : a pocao fica com sabor amadeirado. A pocao fica um pouco mais bem temperada |3|0|
sos : a pocao solta uma fumaca esverdeada e fica com um aspecto mortal. O poder da pocao aumentou |2|15|
lol : a pocao fica poderosa, invocando o poder dos automatos primordiais. O nivel de poder da pocao cresce consideravelmente |0|40|
p   : ao colocar o ovo ele cozinha devido a temperatura do caldeirao. O sabor da pocao melhora bastante |10|0|
a   : a pocao fica levemente rosada. O poder da pocao sobe tanto quanto o peso de uma petala |0|2|
o   : voce colocou agua na pocao e nada acontece |0|0|
omg : um pouco de sal, desespero, tristeza e cansaco foram adicionados. O poder de centenas de estudantes reside agora na pocao |0|20|`;

        const linhas = conteudoMealy.trim().split('\n');
        
        for (const linha of linhas) {
            if (linha.trim() === '') continue;
            
            const partes = linha.split(':');
            if (partes.length !== 2) continue;
            
            const ing = partes[0].trim();
            const descricaoCompleta = partes[1].trim();
            
            // Dividir por | para separar descrição, sabor e poder
            const partesDescricao = descricaoCompleta.split('|');
            if (partesDescricao.length !== 4) continue;
            
            const descricao = partesDescricao[0].trim();
            const sabor = partesDescricao[1].trim();
            const poder = partesDescricao[2].trim();
            
            this.descricoes[ing] = [descricao, sabor, poder];
        }
    }    imprimirDescricoes() {
        let resultado = '';
        for (const [ing, [descricao, sabor, poder]] of Object.entries(this.descricoes)) {
            if (typeof Terminal !== 'undefined') {
                resultado += Terminal.blue(`${ing}: ${descricao} (Sabor: ${sabor}, Poder: ${poder})\n`);
            } else {
                resultado += `${ing}: ${descricao} (Sabor: ${sabor}, Poder: ${poder})\n`;
            }
        }
        return resultado;
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
        this.cont = 0;
        this.poder = 0;
        this.sabor = 0;
        this.ingredientesUsados = [];
        this.historico = [];
    }

    obterEstado() {
        return {
            sabor: this.sabor,
            poder: this.poder,
            ingredientes: this.cont,
            ingredientesUsados: [...this.ingredientesUsados],
            primeiro: this.primeiro
        };
    }

    obterEstatisticas() {
        return {
            totalIngredientes: this.cont,
            saborTotal: this.sabor,
            poderTotal: this.poder,
            ingredientesUsados: this.ingredientesUsados.length,
            mediasSabor: this.cont > 0 ? (this.sabor / this.cont).toFixed(2) : 0,
            mediaPoder: this.cont > 0 ? (this.poder / this.cont).toFixed(2) : 0
        };
    }

    // Método para obter informações sobre ingredientes disponíveis na máquina de Mealy
    getIngredientesDisponiveis() {
        return Object.entries(this.descricoes).map(([simbolo, [descricao, sabor, poder]]) => ({
            simbolo,
            descricao,
            sabor: parseInt(sabor),
            poder: parseInt(poder)
        }));
    }

    // Método para criar tabela HTML dos efeitos dos ingredientes
    criarTabelaEfeitos() {
        let html = '<table class="ingredients-table">';
        html += '<thead><tr><th>Símbolo</th><th>Efeito</th><th>Sabor</th><th>Poder</th></tr></thead>';
        html += '<tbody>';
        
        for (const [simbolo, [descricao, sabor, poder]] of Object.entries(this.descricoes)) {
            const saborFormatado = parseInt(sabor) > 0 ? `+${sabor}` : sabor;
            const poderFormatado = parseInt(poder) > 0 ? `+${poder}` : poder;
            html += `<tr><td>${simbolo}</td><td>${descricao}</td><td>${saborFormatado}</td><td>${poderFormatado}</td></tr>`;
        }
        
        html += '</tbody></table>';
        return html;
    }
}

// Exportar para uso global
window.Mealy = Mealy;
