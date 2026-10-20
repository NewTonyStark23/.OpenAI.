@echo off
REM OpenAI App Factory - Auto Setup Script for Windows
REM This script automatically sets up the development environment

echo.
echo ==========================================
echo   OpenAI App Factory - Auto Setup
echo ==========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

REM Check if npm is installed
echo.
echo [2/5] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION%

REM Check if Git is installed
echo.
echo [3/5] Checking Git...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Git is not installed (optional)
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo ✅ %GIT_VERSION%
)

REM Install dependencies
echo.
echo [4/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Install VSCode extensions
echo.
echo [5/5] Installing VSCode extensions...
where code >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  VSCode CLI not found. Install extensions manually or add VSCode to PATH
    goto :skip_extensions
)

echo Installing ESLint...
call code --install-extension dbaeumer.vscode-eslint --force

echo Installing Prettier...
call code --install-extension esbenp.prettier-vscode --force

echo Installing Tailwind CSS IntelliSense...
call code --install-extension bradlc.vscode-tailwindcss --force

echo Installing ES7+ React Snippets...
call code --install-extension dsznajder.es7-react-js-snippets --force

echo Installing Auto Rename Tag...
call code --install-extension formulahendry.auto-rename-tag --force

echo ✅ VSCode extensions installed

:skip_extensions

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo Creating .env file...
    (
        echo # OpenAI App Factory Configuration
        echo VITE_APP_NAME=OpenAI
        echo VITE_API_URL=http://localhost:3001
    ) > .env
    echo ✅ .env file created
)

REM Open VSCode
echo.
echo Opening VSCode...
where code >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start code .
    echo ✅ VSCode opened
) else (
    echo ⚠️  Could not open VSCode automatically
)

REM Start development server
echo.
echo ==========================================
echo   Starting development server...
echo ==========================================
echo.
echo ✅ Server will be available at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Wait a moment then open browser
timeout /t 2 /nobreak >nul
start http://localhost:5173

REM Start the dev server
call npm run dev
