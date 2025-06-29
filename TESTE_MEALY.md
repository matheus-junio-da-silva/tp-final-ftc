# 🔮 Guia de Teste - Máquina de Mealy (Atualizado)

## ✅ Problemas Corrigidos

1. **Ingrediente `biz` movido para lista correta** - Agora está em ingredientes, não reações
2. **Método `run()` chamado na inicialização** - Máquina adequadamente inicializada
3. **Tratamento de erros melhorado** - Verificações de segurança adicionadas
4. **Botão "Ver Receitas" adicionado** - Novas receitas estratégicas disponíveis

## Como Testar a Máquina de Mealy

### 1. Acesso
- Abra a aplicação no navegador
- Clique em "Começar Aventura"
- Selecione "Máquina de Mealy"

### 2. Interface Atualizada
A interface agora contém:
- **4 Botões de Informação**: Ver Máquina, Ver Efeitos, Ver Alfabeto, **Ver Receitas**
- **Estatísticas Expandidas**: Sabor, Poder, Ingredientes e Estado Atual
- **Visualização do Estado**: Mostra o estado atual da máquina
- **Log Detalhado**: Histórico completo de transições

### 3. Testando Funcionalidade Básica

#### Teste 1: Ingrediente Simples
1. Digite: `biz`
2. Pressione Enter ou clique "Adicionar Ingrediente"
3. **Esperado**: 
   - Estado muda de q0 → q_poderoso
   - Poder aumenta para 100
   - Log mostra transição
   - Som de sucesso

#### Teste 2: Sequência de Ingredientes
1. Digite: `pip` (deve ir para q_saboroso)
2. Digite: `lol` (deve ir para q_poderoso)
3. **Esperado**: Transições mostradas no log e estado

### 4. Testando Receitas Sugeridas

#### 🌟 Receita da Poção Lendária
```
Sequência: biz → lol → omg → biz → lol
Objetivo: Alcançar poder ≥ 400
Estados: q0 → q_poderoso → q_poderoso → q_poderoso → q_poderoso → q_poderoso
Resultado: Poder: 360, Sabor: 0
```

#### 🍯 Receita da Poção Saborosa
```
Sequência: pip → bur → p → pix
Objetivo: Maximizar sabor
Estados: q0 → q_saboroso → q_saboroso → q_saboroso → q_saboroso
Resultado: Sabor: 32, Poder: 5
```

#### ⚡ Receita da Poção Equilibrada
```
Sequência: biz → pip → bur → sos
Objetivo: Balancear sabor e poder
Estados: q0 → q_poderoso → q_saboroso → q_saboroso → q_mortal
Resultado: Sabor: 19, Poder: 120
```

### 5. Funcionalidades de Informação

#### Ver Receitas (NOVO!)
- Clique no botão "Ver Receitas"
- Veja receitas estratégicas com:
  - Sequências específicas
  - Estados esperados
  - Resultados previstos
  - Dicas e estratégias

#### Ver Máquina
- Definição formal completa
- Estados e alfabeto
- Estado atual destacado

#### Ver Efeitos
- Tabela completa de ingredientes
- Efeitos de sabor e poder

#### Ver Alfabeto
- Grid visual dos símbolos
- Correspondência com ingredientes

### 6. Testes de Validação

#### Teste de Ingrediente Inválido
1. Digite: `xyz` (não existe)
2. **Esperado**: Mensagem de erro "Ingrediente não reconhecido"

#### Teste de Sabor Negativo
1. Digite qualquer ingrediente
2. Digite: `pum`
3. **Esperado**: Sabor fica -100, avaliação falha

#### Teste de Muitos Ingredientes
1. Adicione 11 ingredientes
2. **Esperado**: "Muito misturado" na avaliação

### 7. Estados da Máquina

| Estado | Descrição | Ingredientes que Levam |
|--------|-----------|------------------------|
| q0 | Estado Inicial | - |
| q_poderoso | Ingredientes mágicos | biz, lol, omg |
| q_saboroso | Ingredientes saborosos | pip, bur, pix, zap, p |
| q_ruim | Ingredientes prejudiciais | pum |
| q_mortal | Ingredientes perigosos | sos |
| q_neutro | Ingredientes básicos | nho, bab, a, o |

### 8. Solução de Problemas

#### Se não funcionar:
1. **Recarregue a página** - F5
2. **Verifique o console** - F12 para ver erros
3. **Teste ingredientes básicos** - Comece com `biz` ou `pip`
4. **Verifique se está na tela correta** - Máquina de Mealy

#### Mensagens de Erro Comuns:
- "Ingrediente não reconhecido" → Use símbolos válidos
- "Máquina não inicializada" → Recarregue a página
- "Alfabeto não carregado" → Verifique inicialização

## 🎯 Checklist de Teste Completo

- [ ] Acesso à máquina de Mealy funciona
- [ ] Botões informativos funcionam (4 botões)
- [ ] Adição de ingredientes válidos funciona
- [ ] Estados mudam corretamente
- [ ] Log mostra transições detalhadas
- [ ] Estatísticas atualizam em tempo real
- [ ] Receitas estão disponíveis e úteis
- [ ] Avaliação final funciona
- [ ] Sons funcionam (se habilitados)
- [ ] Ingredientes inválidos são rejeitados
- [ ] Interface responsiva funciona

## 📚 Alfabeto Completo

```
biz : biscoito de bruxa malvada
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
omg : oh my god concentrado
```
