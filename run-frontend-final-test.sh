#!/bin/bash

echo "========================================"
echo "Tests Frontend Finaux - CommuniConnect"
echo "========================================"
echo

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo

# Vérifier si le serveur frontend fonctionne
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "WARNING: Frontend server might not be running on port 3000"
    echo "Starting frontend server in background..."
    cd client && npm start > /dev/null 2>&1 &
    FRONTEND_PID=$!
    echo "Waiting for server to start..."
    sleep 10
    echo "Frontend server started with PID: $FRONTEND_PID"
else
    echo "Frontend server is already running"
fi

echo
echo "Starting final frontend tests..."
echo

# Exécuter les tests
node run-frontend-final-test.js

# Nettoyer si on a démarré le serveur
if [ ! -z "$FRONTEND_PID" ]; then
    echo "Stopping frontend server..."
    kill $FRONTEND_PID 2>/dev/null
fi

echo
echo "========================================"
echo "Tests completed!"
echo "========================================" 