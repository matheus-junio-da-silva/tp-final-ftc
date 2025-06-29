// Teste simples para verificar se a máquina de Mealy está funcionando
console.log('🧪 Testando Máquina de Mealy...');

// Simular inicialização
try {
    // Simular dados de ingredientes
    const dadosIngredientes = `biz : biscoito de bruxa malvada
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

    const dadosReacoes = `a  : apimentada
s  : salgada demais
mor: mortífera`;

    // Testar Alfabeto
    console.log('1. Testando Alfabeto...');
    const alfabeto = new Alfabeto(dadosIngredientes, dadosReacoes);
    console.log('✅ Alfabeto criado com sucesso');
    
    // Testar ingredientes
    const testIngredients = ['biz', 'pip', 'pum', 'lol', 'xyz'];
    testIngredients.forEach(ing => {
        const valido = alfabeto.validaIngrediente(ing);
        console.log(`   ${ing}: ${valido ? '✅' : '❌'} ${valido ? alfabeto.descreveIngrediente(ing) : 'Inválido'}`);
    });

    // Testar Máquina de Mealy
    console.log('2. Testando Máquina de Mealy...');
    const mealy = new Mealy();
    console.log('✅ Máquina de Mealy criada com sucesso');
    
    // Testar estados
    console.log(`   Estado inicial: ${mealy.estadoAtual}`);
    console.log(`   Estados disponíveis: ${Object.keys(mealy.estados).join(', ')}`);
    console.log(`   Alfabeto: ${mealy.alfabeto.join(', ')}`);
    
    // Testar adição de ingredientes
    console.log('3. Testando adição de ingredientes...');
    const testSequence = ['biz', 'pip', 'lol'];
    
    testSequence.forEach((ing, index) => {
        console.log(`   Teste ${index + 1}: Adicionando "${ing}"`);
        const sucesso = mealy.adicionarIngrediente(ing, alfabeto);
        if (sucesso) {
            const estado = mealy.obterEstado();
            console.log(`   ✅ Sucesso! Estado: ${estado.estadoAtual}, Sabor: ${estado.sabor}, Poder: ${estado.poder}`);
        } else {
            console.log(`   ❌ Falha ao adicionar "${ing}"`);
        }
    });
    
    // Testar avaliação final
    console.log('4. Testando avaliação final...');
    const resultado = mealy.avaliarPocao();
    console.log(`   Resultado: ${resultado.sucesso ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`   Motivo: ${resultado.motivo}`);
    console.log(`   Estatísticas: Sabor ${resultado.sabor}, Poder ${resultado.poder}, Ingredientes ${resultado.ingredientes}`);

    console.log('🎉 Todos os testes concluídos!');

} catch (error) {
    console.error('❌ Erro durante o teste:', error);
}
