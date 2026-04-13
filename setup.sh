#!/bin/bash

# Smart Hospital Management System - Quick Setup Script

echo "🏥 Smart Hospital Management System - Setup"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 is installed"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not found. Please ensure MySQL is installed and running."
    echo "   You can install MySQL and then run this script again."
fi

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your MySQL credentials before proceeding!"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

# Ask if user wants to generate sample data
echo ""
read -p "Do you want to generate sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Generating sample data..."
    python data/generate_sample_data.py
    echo ""
    echo "✅ Sample data generated successfully!"
    echo ""
    echo "📝 Login Credentials:"
    echo "   Admin: username='admin', password='admin123'"
    echo "   Doctor: username='dr.[lastname]', password='doctor123'"
    echo "   Receptionist: username='receptionist', password='reception123'"
fi

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Make sure MySQL is running"
echo "  2. Activate virtual environment: source venv/bin/activate"
echo "  3. Run the app: cd backend/app && python main.py"
echo ""
echo "The API will be available at http://localhost:5000"
echo "=========================================="
