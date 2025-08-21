@echo off
echo 🚀 Starting deployment process...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Build the client
echo 🔨 Building client application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Failed to build client application
    pause
    exit /b 1
)

echo ✅ Client application built successfully

REM Check if build directory exists
if not exist "client\dist" (
    echo ❌ Build directory 'client\dist' not found
    pause
    exit /b 1
)

echo ✅ Build directory verified

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo 📝 Please create a .env file with your environment variables
    echo 📚 See env.example for reference
) else (
    echo ✅ .env file found
)

echo.
echo 🎉 Deployment preparation completed!
echo.
echo 📋 Next steps:
echo 1. Push your changes to GitHub: git push origin main
echo 2. Go to [render.com](https://render.com) and create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Set the environment variables in Render
echo 5. Deploy!
echo.
echo 📚 For detailed instructions, see RENDER_DEPLOYMENT.md
pause
