#!/bin/bash

# Mimi Sữa - Development Setup

echo "🍼 Mimi Sữa - Development Setup"
echo "==============================="

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Setup Bot
echo -e "\n📦 Installing Bot dependencies..."
cd bot

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit bot/.env and add TELEGRAM_BOT_TOKEN"
fi

pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "  1. Edit bot/.env with your TELEGRAM_BOT_TOKEN"
echo "  2. Run: python bot.py"
echo "  3. Open: file://$(pwd)/../dashboard/index.html"
echo ""
echo "📝 Run in separate terminals:"
echo "  Terminal 1: cd bot && python bot.py"
echo "  Terminal 2: cd bot && python api.py"
echo "  Terminal 3: Open dashboard/index.html in browser"
