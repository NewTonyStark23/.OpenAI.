#!/bin/bash

# OpenAI App Factory - Auto Setup Script
# This script automatically sets up the development environment

set -e  # Exit on error

echo "🚀 OpenAI App Factory - Auto Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}📦 Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check if npm is installed
echo -e "${BLUE}📦 Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# Check if Git is installed
echo -e "${BLUE}📦 Checking Git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}⚠️  Git is not installed (optional)${NC}"
else
    echo -e "${GREEN}✅ Git $(git --version | cut -d' ' -f3)${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📥 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Install VSCode extensions (if VSCode is available)
echo ""
echo -e "${BLUE}🔌 Installing VSCode extensions...${NC}"
if command -v code &> /dev/null; then
    echo "Installing ESLint..."
    code --install-extension dbaeumer.vscode-eslint --force || true
    
    echo "Installing Prettier..."
    code --install-extension esbenp.prettier-vscode --force || true
    
    echo "Installing Tailwind CSS IntelliSense..."
    code --install-extension bradlc.vscode-tailwindcss --force || true
    
    echo "Installing ES7+ React Snippets..."
    code --install-extension dsznajder.es7-react-js-snippets --force || true
    
    echo "Installing Auto Rename Tag..."
    code --install-extension formulahendry.auto-rename-tag --force || true
    
    echo -e "${GREEN}✅ VSCode extensions installed${NC}"
else
    echo -e "${YELLOW}⚠️  VSCode CLI not found. Install extensions manually or add VSCode to PATH${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo -e "${BLUE}📝 Creating .env file...${NC}"
    cat > .env << EOF
# OpenAI App Factory Configuration
VITE_APP_NAME=OpenAI
VITE_API_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
fi

# Open VSCode
echo ""
echo -e "${BLUE}📂 Opening VSCode...${NC}"
if command -v code &> /dev/null; then
    code .
    echo -e "${GREEN}✅ VSCode opened${NC}"
else
    echo -e "${YELLOW}⚠️  Could not open VSCode automatically${NC}"
fi

# Start development server
echo ""
echo -e "${BLUE}🚀 Starting development server...${NC}"
echo -e "${GREEN}✅ Server will be available at http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Wait a moment then open browser
sleep 2
if command -v open &> /dev/null; then
    open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
fi

# Start the dev server
npm run dev
