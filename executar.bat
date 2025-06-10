@echo off
title Alquimia Automatica - Simulador de Pocoes Web
color 0E

echo.
echo  ========================================
echo  🧙‍♂️ Alquimia Automatica - Simulador de Pocoes
echo  ========================================
echo.

echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python nao encontrado. Instale Python 3.x
    echo    Download: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✅ Python encontrado

echo.
echo Verificando arquivos do projeto...
if not exist "index.html" (
    echo ❌ index.html nao encontrado
    echo    Execute este arquivo no diretorio do projeto
    pause
    exit /b 1
)
echo ✅ Arquivos do projeto encontrados

echo.
echo 🚀 Iniciando servidor HTTP local...
echo    Acesse: http://localhost:8000
echo    Pressione Ctrl+C para parar
echo.

start http://localhost:8000
python -m http.server 8000

pause
