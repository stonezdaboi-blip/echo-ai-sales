#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        ECHO - Autonomous AI Sales Intelligence System          ║"
echo "║                    Quick Start Script                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

echo ""
echo "✅ Installation complete!"
echo ""

# Create .env files
echo "🔧 Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (update with your config)"
fi

if [ ! -f backend/.env.development ]; then
    cp backend/.env.development backend/.env.development
    echo "✅ Created backend/.env.development"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    Ready to Start!                            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Start development:"
echo "  npm run dev"
echo ""
echo "Or start separately:"
echo "  npm run backend  (Terminal 1)"
echo "  npm run mobile   (Terminal 2)"
echo ""
echo "Docs: https://github.com/stonezdaboi-blip/echo-ai-sales"
echo ""
