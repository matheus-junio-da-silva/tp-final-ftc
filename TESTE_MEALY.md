# 🔮 Guia de Teste - Máquina de Mealy

## Como Testar a Máquina de Mealy

### 1. Acesso
- Abra a aplicação no navegador
- Clique em "Começar Aventura"
- Selecione "Máquina de Mealy"

### 2. Interface Melhorada
A interface agora contém:
- **Botões de Informação**: Ver Máquina, Ver Efeitos, Ver Alfabeto
- **Estatísticas Expandidas**: Sabor, Poder, Ingredientes e Estado Atual
- **Visualização do Estado**: Mostra o estado atual da máquina (q0, q_poderoso, etc.)

### 3. Alfabeto Disponível
Símbolos aceitos pela máquina:
```
biz, bab, nho, pip, pum, bur, pix, zap, sos, lol, p, a, o, omg
```

### 4. Testes Recomendados

#### Teste 1: Ingredientes Poderosos
- Digite: `biz` (deve ir para estado q_poderoso)
- Digite: `lol` (continua em estado poderoso)
- Observe: Poder aumenta significativamente

#### Teste 2: Ingredientes Saborosos  
- Digite: `pip` (deve ir para estado q_saboroso)
- Digite: `bur` (continua em estado saboroso)
- Observe: Sabor aumenta

#### Teste 3: Ingrediente Ruim
- Digite: `pum` (deve ir para estado q_ruim)
- Observe: Sabor fica negativo (-100)

#### Teste 4: Sequência Mista
- Digite: `p` (saboroso) → `biz` (poderoso) → `omg` (poderoso)
- Observe as transições de estado

### 5. Funcionalidades de Informação

#### Ver Máquina
- Clique no botão "Ver Máquina"
- Veja: Estados, alfabeto, função de saída, estado atual

#### Ver Efeitos
- Clique no botão "Ver Efeitos"
- Tabela completa com todos os efeitos dos ingredientes

#### Ver Alfabeto
- Clique no botão "Ver Alfabeto"
- Lista dos símbolos aceitos e ingredientes correspondentes

### 6. Validações

#### Máquina de Mealy Correta
✅ **Estados definidos**: q0, q_poderoso, q_saboroso, q_ruim, q_mortal, q_neutro
✅ **Transições**: Baseadas no tipo de ingrediente
✅ **Saídas**: Descrição + modificações de sabor/poder
✅ **Alfabeto**: Claramente definido
✅ **Histórico**: Log detalhado com transições

#### O que foi Corrigido
1. ✅ Adicionada função `obterUltimaReacao()`
2. ✅ Definidos estados formais da máquina
3. ✅ Implementada função de transição
4. ✅ Alfabeto claramente definido
5. ✅ Interface melhorada com informações
6. ✅ Visualização do estado atual
7. ✅ Botões informativos

### 7. Exemplo de Teste Completo

1. **Iniciar**: Estado q0
2. **Adicionar `biz`**: 
   - Transição: q0 → q_poderoso
   - Sabor: +0, Poder: +100
   - Descrição: "um dos artefatos mais poderosos..."
3. **Adicionar `pip`**:
   - Transição: q_poderoso → q_saboroso
   - Sabor: +12, Poder: +0
   - Total: Sabor: 12, Poder: 100
4. **Finalizar**: Obter avaliação do oráculo

### 8. Mensagens de Erro Esperadas
- Ingrediente não reconhecido: símbolo não no alfabeto
- Ingrediente sem efeitos: não definido na máquina

## Estados da Máquina

| Estado | Descrição | Ingredientes que Levam |
|--------|-----------|------------------------|
| q0 | Estado Inicial | - |
| q_poderoso | Ingredientes mágicos | biz, lol, omg |
| q_saboroso | Ingredientes saborosos | pip, bur, pix, zap, p |
| q_ruim | Ingredientes prejudiciais | pum |
| q_mortal | Ingredientes perigosos | sos |
| q_neutro | Ingredientes básicos | nho, bab, a, o |
