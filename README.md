# Alquimia Automática - Versão Web

Esta é a versão web do simulador de criação de poções usando autômatos finitos e máquinas de Mealy.

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
