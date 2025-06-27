# Alquimia Automática - Versão Web

Esta é a versão web do simulador de criação de poções usando autômatos finitos e máquinas de Mealy, convertida do código Python original.

## 🧙‍♂️ Sobre o Projeto

O **Alquimia Automática** é um simulador interativo que permite:

1. **Autômatos Determinísticos (AFD/APD)**: Criar poções seguindo receitas baseadas em autômatos finitos ou de pilha
2. **Máquina de Mealy**: Avaliação de poções pelo "Oráculo Místico" com sistema de pontuação

## 🚀 Como Executar

### Opção 1: Script Automático (Recomendado)
```bash
# Execute o arquivo batch (Windows)
executar.bat

# Ou o script PowerShell
.\executar.ps1
```

### Opção 2: Servidor Local Manual
```bash
# Navegue até o diretório do projeto
cd "c:\Users\mathe\Downloads\ftc-final\TP_Final_FTC"

# Inicie um servidor HTTP simples (Python)
python -m http.server 8000

# Acesse no navegador: http://localhost:8000
```

### Opção 3: Live Server (VS Code)
Se estiver usando VS Code, instale a extensão "Live Server" e clique com o botão direito em `index.html` → "Open with Live Server".

⚠️ **Importante**: Não abra `index.html` diretamente no navegador, pois alguns recursos não funcionarão devido a restrições de CORS.

## 🎮 Como Usar

### 1. Autômatos Determinísticos
1. Clique em "Autômato Determinístico" no menu principal
2. Escolha uma receita da lista ou digite o nome
3. Adicione ingredientes seguindo a sequência da receita
4. Finalize a poção quando terminar

### 2. Máquina de Mealy
1. Clique em "Máquina de Mealy" no menu principal
2. Adicione ingredientes para criar uma poção
3. O oráculo místico avaliará sabor e poder
4. Veja a avaliação final!

## 📋 Receitas Disponíveis

- **pocao_da_sabedoria**: Receita complexa que requer sequência específica
- **receita_da_morte**: Poção perigosa com ingredientes mortais
- **pocao_de_restauracao_comum**: Receita simples para iniciantes
- **pocao_ciclica**: Usa autômato de pilha com ciclos
- **receita1, receitaAPD, receitand, receitand2**: Outras receitas de exemplo

## 🧪 Ingredientes Disponíveis

| Símbolo | Ingrediente |
|---------|-------------|
| biz | biscoito de bruxa malvada |
| bab | baba de camelo fedida |
| nho | nhonho de gato persa |
| pip | pipoca magica explosiva |
| pum | pum de dragao fedorento |
| bur | buraco negro comestivel |
| pix | pixie dust colorido |
| zap | zapzap eletrico infinito |
| sos | sossega leao instantaneo |
| lol | lolzinho magico hilario |
| p | petalas |
| a | agua |
| o | oleo |
| omg | oh my god concentrado |

## 🔧 Estrutura Técnica

### Conversão Python → JavaScript

| Arquivo Python | Arquivo JavaScript | Função |
|----------------|-------------------|---------|
| `alfabeto.py` | `js/alfabeto.js` | Gerencia ingredientes e reações |
| `automato.py` | `js/automato.js` | Execução de autômatos |
| `receita.py` | `js/receita.js` | Estrutura das receitas |
| `leitura.py` | `js/leitura.js` | Parser de receitas |
| `mealy.py` | `js/mealy.js` | Máquina de Mealy |
| `sound.py` | `js/sound.js` | Sistema de áudio |
| `terminal.py` | `js/terminal.js` | Formatação de texto |
| `main.py` | `js/main.js` | Controlador principal |

### Tecnologias Utilizadas

- **HTML5**: Estrutura da interface
- **CSS3**: Estilização com tema mágico e responsividade
- **JavaScript ES6+**: Lógica da aplicação
- **Web Audio API**: Sistema de som
- **CSS Grid/Flexbox**: Layout responsivo

## 🎨 Características da Interface

- **Tema Mágico**: Cores roxas e douradas com efeitos de partículas
- **Responsiva**: Funciona em desktop, tablet e mobile
- **Animações**: Caldeirão borbulhante, oráculo místico animado
- **Som**: Efeitos sonoros e música de fundo
- **Modal**: Visualização de receitas e ingredientes

## 🐛 Recursos Implementados

### ✅ Funcionalidades Convertidas
- [x] Carregamento de alfabetos (ingredientes/reações)
- [x] Parser de receitas de autômatos
- [x] Execução de AFD (Autômatos Finitos Determinísticos)
- [x] Execução de APD (Autômatos de Pilha Determinísticos)
- [x] Máquina de Mealy com avaliação
- [x] Sistema de som completo
- [x] Interface gráfica intuitiva
- [x] Validação de determinismo
- [x] Histórico de execução
- [x] Mensagens coloridas
- [x] ASCII Art temático

### 🎯 Melhorias da Versão Web
- Interface gráfica moderna
- Animações e efeitos visuais
- Responsividade para dispositivos móveis
- Controle de som integrado
- Feedback visual imediato
- Sistema de modais informativos

## 🔊 Sistema de Áudio

O sistema de áudio inclui:
- **Música de fundo**: Ambiente mágico
- **Efeitos sonoros**: Adicionar ingredientes, criar poções, falhas
- **Sons do oráculo**: Avaliação da máquina de Mealy
- **Controle de volume**: Botão para ligar/desligar

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet, smartphone
- **Resolução**: Responsivo desde 320px até 4K
- **Audio**: Web Audio API suportada

## 🧪 Status dos Testes

### ✅ Testes Realizados
- **Conversão de módulos**: 8/8 módulos convertidos com sucesso
- **Funcionalidades**: Todas as funcionalidades originais preservadas
- **Interface**: Design responsivo e moderno implementado
- **Audio**: Sistema de som totalmente funcional
- **Validação**: Testes automatizados aprovados

### 📊 Páginas de Teste
- `teste-funcional.html` - Testes automatizados das funcionalidades
- `test.html` - 
- `demo.html` - Demonstração interativa
- `relatorio-final.html` - 

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como trabalho prático da disciplina de **Fundamentos Teóricos da Computação (FTC)**, demonstrando:

- Implementação de autômatos finitos determinísticos (AFD)
- Autômatos de pilha determinísticos (APD)
- Máquinas de Mealy com função de saída
- Análise de linguagens formais
- Validação de determinismo em autômatos
- Conversão de código Python para JavaScript mantendo equivalência funcional

## 🤝 Integrantes





## 📄 Licença

Este projeto é parte de um trabalho acadêmico e está disponível para fins educacionais.
