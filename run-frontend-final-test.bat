@echo off
echo ========================================
echo Tests Frontend Finaux - CommuniConnect
echo ========================================
echo.

echo Verifying Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Verifying npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo Checking if frontend server is running...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo WARNING: Frontend server might not be running on port 3000
    echo Starting frontend server in background...
    start /B cmd /c "cd client && npm start"
    echo Waiting for server to start...
    timeout /t 10 /nobreak >nul
)

echo.
echo Starting final frontend tests...
echo.

node run-frontend-final-test.js

echo.
echo ========================================
echo Tests completed!
echo ========================================
pause 