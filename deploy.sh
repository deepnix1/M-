#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the client
echo "🔨 Building client application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build client application"
    exit 1
fi

echo "✅ Client application built successfully"

# Check if build directory exists
if [ ! -d "client/dist" ]; then
    echo "❌ Build directory 'client/dist' not found"
    exit 1
fi

echo "✅ Build directory verified"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "📝 Please create a .env file with your environment variables"
    echo "📚 See env.example for reference"
else
    echo "✅ .env file found"
fi

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Push your changes to GitHub: git push origin main"
echo "2. Go to [render.com](https://render.com) and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set the environment variables in Render"
echo "5. Deploy!"
echo ""
echo "📚 For detailed instructions, see RENDER_DEPLOYMENT.md"
