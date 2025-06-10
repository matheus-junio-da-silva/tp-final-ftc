# Script PowerShell para executar o Alquimia Automática
# Alquimia Automática - Simulador de Poções Web

Write-Host "🧙‍♂️ Alquimia Automática - Simulador de Poções" -ForegroundColor Magenta
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado. Por favor, instale o Python 3.x" -ForegroundColor Red
    Write-Host "   Download: https://www.python.org/downloads/" -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar se estamos no diretório correto
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Arquivo index.html não encontrado." -ForegroundColor Red
    Write-Host "   Execute este script a partir do diretório do projeto." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "📁 Diretório do projeto: $(Get-Location)" -ForegroundColor Blue
Write-Host ""

# Menu de opções
Write-Host "Escolha uma opção:" -ForegroundColor Yellow
Write-Host "1. 🚀 Executar aplicação (servidor local)" -ForegroundColor White
Write-Host "2. 📖 Ver guia de demonstração" -ForegroundColor White
Write-Host "3. 🔧 Verificar estrutura do projeto" -ForegroundColor White
Write-Host "4. 📋 Mostrar receitas disponíveis" -ForegroundColor White
Write-Host "5. ❌ Sair" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite sua escolha (1-5)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Iniciando servidor HTTP local..." -ForegroundColor Green
        Write-Host "   Servidor: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
        Write-Host ""
        
        # Tentar abrir no navegador padrão
        Start-Process "http://localhost:8000"
        
        # Iniciar servidor
        python -m http.server 8000
    }
    
    "2" {
        Write-Host "📖 Iniciando guia de demonstração..." -ForegroundColor Green
        
        # Iniciar servidor em background
        $job = Start-Job -ScriptBlock { 
            Set-Location $using:PWD
            python -m http.server 8001 
        }
        
        Start-Sleep 2
        Start-Process "http://localhost:8001/demo.html"
        
        Write-Host "   Guia: http://localhost:8001/demo.html" -ForegroundColor Cyan
        Write-Host "   Pressione qualquer tecla para parar..." -ForegroundColor Yellow
        
        Read-Host
        Stop-Job $job
        Remove-Job $job
    }
    
    "3" {
        Write-Host "🔧 Estrutura do projeto:" -ForegroundColor Green
        Write-Host ""
        
        $files = @(
            "index.html - Interface principal",
            "styles.css - Estilos da aplicação", 
            "demo.html - Guia de demonstração",
            "js/ - Módulos JavaScript:",
            "  ├── main.js - Controlador principal",
            "  ├── alfabeto.js - Gerencia ingredientes",
            "  ├── automato.js - Execução de autômatos",
            "  ├── receita.js - Estrutura das receitas",
            "  ├── leitura.js - Parser de receitas",
            "  ├── mealy.js - Máquina de Mealy",
            "  ├── sound.js - Sistema de áudio",
            "  └── terminal.js - Formatação de texto",
            "pocoes/ - Dados das receitas:",
            "  ├── ingredientes.txt - Lista de ingredientes",
            "  ├── reacoes.txt - Lista de reações",
            "  └── *.txt - Receitas de autômatos",
            "sound/ - Arquivos de áudio:",
            "  ├── background.mp3 - Música de fundo",
            "  ├── ingrediente.mp3 - Som de ingrediente",
            "  └── *.mp3/*.wav - Outros efeitos"
        )
        
        foreach ($file in $files) {
            if ($file.StartsWith("  ")) {
                Write-Host $file -ForegroundColor Gray
            } elseif ($file.Contains(":")) {
                Write-Host $file -ForegroundColor Yellow
            } else {
                Write-Host $file -ForegroundColor White
            }
        }
        
        Write-Host ""
        pause
    }
    
    "4" {
        Write-Host "📋 Receitas disponíveis:" -ForegroundColor Green
        Write-Host ""
        
        $receitas = @(
            "pocao_da_sabedoria - Receita complexa (5 ingredientes)",
            "receita_da_morte - Poção perigosa (5 ingredientes)", 
            "pocao_de_restauracao_comum - Receita simples (3 ingredientes)",
            "pocao_ciclica - Usa autômato de pilha (5 ingredientes)",
            "receita1 - Exemplo de APD (3 ingredientes)",
            "receitaAPD - Autômato de pilha complexo (6 ingredientes)",
            "receitand - Não determinístico (3 ingredientes)",
            "receitand2 - AFD simples (3 ingredientes)"
        )
        
        foreach ($receita in $receitas) {
            Write-Host "  • $receita" -ForegroundColor Cyan
        }
        
        Write-Host ""
        Write-Host "💡 Dica: Para testar, use receitas simples primeiro!" -ForegroundColor Yellow
        Write-Host ""
        pause
    }
    
    "5" {
        Write-Host "👋 Até logo!" -ForegroundColor Magenta
        exit 0
    }
    
    default {
        Write-Host "❌ Opção inválida. Execute o script novamente." -ForegroundColor Red
        pause
    }
}

Write-Host ""
Write-Host "Script finalizado." -ForegroundColor Green
