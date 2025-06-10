/**
 * Validação da conversão Python → JavaScript
 * Script para verificar se todas as funcionalidades foram convertidas corretamente
 */

// Testes de validação das classes convertidas
function validarConversao() {
    const resultados = {
        alfabeto: false,
        receita: false,
        automato: false,
        mealy: false,
        leitura: false,
        sound: false,
        terminal: false
    };

    console.log('🧪 Iniciando validação da conversão...\n');

    // Teste 1: Alfabeto
    try {
        const dadosIngredientes = `a : agua\np : petala\ntest : ingrediente de teste`;
        const dadosReacoes = `mor : mortífera\ns : salgada`;
        
        const alfabeto = new Alfabeto(dadosIngredientes, dadosReacoes);
        
        if (alfabeto.validaIngrediente('a') && 
            alfabeto.validaIngrediente('p') && 
            !alfabeto.validaIngrediente('xyz') &&
            alfabeto.descreveIngrediente('a') === 'agua') {
            resultados.alfabeto = true;
            console.log('✅ Alfabeto: Conversão bem-sucedida');
        } else {
            console.log('❌ Alfabeto: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Alfabeto: Erro na conversão -', error.message);
    }

    // Teste 2: Receita e Regras
    try {
        const receita = new Receita(['q0', 'q1', 'qf'], 'q0', ['qf']);
        receita.insereTransicao('q0', 'q1', 'a');
        receita.insereTransicao('q1', 'qf', 'b');
        
        if (receita.inicial === 'q0' && 
            receita.finais.includes('qf') &&
            Object.keys(receita.estados).length === 3) {
            resultados.receita = true;
            console.log('✅ Receita: Conversão bem-sucedida');
        } else {
            console.log('❌ Receita: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Receita: Erro na conversão -', error.message);
    }

    // Teste 3: Autômato
    try {
        const receita = new Receita(['q0', 'q1'], 'q0', ['q1']);
        receita.insereTransicao('q0', 'q1', 'a');
        
        const automato = new Automato(receita);
        
        if (automato.estadoAtual === 'q0' && 
            automato.pilha.length === 0 &&
            !automato.erro) {
            resultados.automato = true;
            console.log('✅ Autômato: Conversão bem-sucedida');
        } else {
            console.log('❌ Autômato: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Autômato: Erro na conversão -', error.message);
    }

    // Teste 4: Máquina de Mealy
    try {
        const mealy = new Mealy();
        
        if (typeof mealy.descricoes === 'object' &&
            typeof mealy.obterEstado === 'function' &&
            mealy.sabor === 0 && mealy.poder === 0) {
            resultados.mealy = true;
            console.log('✅ Mealy: Conversão bem-sucedida');
        } else {
            console.log('❌ Mealy: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Mealy: Erro na conversão -', error.message);
    }

    // Teste 5: Leitura
    try {
        const gerenciador = new GerenciadorReceitas();
        
        if (typeof gerenciador.receitas === 'object' &&
            gerenciador.listarReceitas().length > 0 &&
            gerenciador.receitaExiste('pocao_da_sabedoria')) {
            resultados.leitura = true;
            console.log('✅ Leitura: Conversão bem-sucedida');
        } else {
            console.log('❌ Leitura: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Leitura: Erro na conversão -', error.message);
    }

    // Teste 6: Sound
    try {
        const soundManager = new SoundManager();
        
        if (typeof soundManager.sounds === 'object' &&
            typeof soundManager.playSound === 'function' &&
            typeof soundManager.toggleSound === 'function') {
            resultados.sound = true;
            console.log('✅ Sound: Conversão bem-sucedida');
        } else {
            console.log('❌ Sound: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Sound: Erro na conversão -', error.message);
    }

    // Teste 7: Terminal
    try {
        const texto = Terminal.red('teste');
        const art = Terminal.getTitleArt();
        
        if (texto.includes('color-red') && 
            art.includes('@@@') &&
            typeof Terminal.log === 'function') {
            resultados.terminal = true;
            console.log('✅ Terminal: Conversão bem-sucedida');
        } else {
            console.log('❌ Terminal: Falha na validação');
        }
    } catch (error) {
        console.log('❌ Terminal: Erro na conversão -', error.message);
    }

    // Resultado final
    console.log('\n📊 Resultado da Validação:');
    const sucessos = Object.values(resultados).filter(r => r).length;
    const total = Object.keys(resultados).length;
    
    console.log(`   ✅ Módulos convertidos: ${sucessos}/${total}`);
    console.log(`   📈 Taxa de sucesso: ${Math.round((sucessos/total)*100)}%`);
    
    if (sucessos === total) {
        console.log('\n🎉 Conversão Python → JavaScript COMPLETA!');
        console.log('   Todas as funcionalidades foram convertidas com sucesso.');
    } else {
        console.log('\n⚠️ Conversão parcialmente bem-sucedida.');
        console.log('   Alguns módulos podem precisar de ajustes.');
    }

    return resultados;
}

// Teste de integração completa
function testeIntegracao() {
    console.log('\n🔄 Executando teste de integração...\n');

    try {
        // Simular fluxo completo de criação de poção
        console.log('1. Criando alfabeto...');
        const dadosIngredientes = `a : agua\np : petala`;
        const dadosReacoes = `mor : mortífera`;
        const alfabeto = new Alfabeto(dadosIngredientes, dadosReacoes);

        console.log('2. Carregando receita...');
        const gerenciador = new GerenciadorReceitas();
        const receita = gerenciador.carregarReceita('pocao_de_restauracao_comum', alfabeto);

        console.log('3. Criando autômato...');
        receita.then(r => {
            if (r) {
                const automato = new Automato(r);
                
                console.log('4. Executando transições...');
                automato.executaTransicao('a', alfabeto);
                automato.executaTransicao('p', alfabeto);
                automato.executaTransicao('p', alfabeto);
                
                console.log('5. Verificando resultado...');
                const aceito = automato.reconheceu();
                
                if (aceito) {
                    console.log('✅ Teste de integração: SUCESSO');
                    console.log('   Poção criada com sucesso!');
                } else {
                    console.log('❌ Teste de integração: FALHA');
                    console.log('   Poção não foi aceita pelo autômato');
                }
            } else {
                console.log('❌ Erro ao carregar receita');
            }
        }).catch(error => {
            console.log('❌ Erro no teste de integração:', error.message);
        });

    } catch (error) {
        console.log('❌ Erro no teste de integração:', error.message);
    }
}

// Executar validação automaticamente quando o script for carregado
if (typeof window !== 'undefined') {
    // Aguardar o carregamento completo da página
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🚀 Executando validação automática...\n');
            const resultados = validarConversao();
            testeIntegracao();
            
            // Disponibilizar resultados globalmente
            window.validacao = resultados;
        }, 1000);
    });
}

// Exportar funções para uso manual
if (typeof window !== 'undefined') {
    window.validarConversao = validarConversao;
    window.testeIntegracao = testeIntegracao;
}
