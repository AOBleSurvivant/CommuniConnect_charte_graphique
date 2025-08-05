# 🚀 Script de Déploiement Vercel - CommuniConnect
# PowerShell Script pour Windows

Write-Host "🚀 Déploiement CommuniConnect sur Vercel" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Vérification de Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérification de npm
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm n'est pas installé." -ForegroundColor Red
    exit 1
}

# Installation de Vercel CLI si nécessaire
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installation de Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Installation des dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm run install-all

# Build du client
Write-Host "🔨 Build du client React..." -ForegroundColor Yellow
Set-Location client
npm run build
Set-Location ..

# Vérification du build
if (!(Test-Path "client/build")) {
    Write-Host "❌ Erreur: Le build n'a pas été créé" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build réussi!" -ForegroundColor Green

# Déploiement sur Vercel
Write-Host "🌐 Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "🌍 Votre application est maintenant en ligne!" -ForegroundColor Green

# Instructions post-déploiement
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Configurez les variables d'environnement sur Vercel Dashboard" -ForegroundColor White
Write-Host "2. Configurez votre base de données MongoDB Atlas" -ForegroundColor White
Write-Host "3. Testez votre application en ligne" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consultez DEPLOIEMENT_GRATUIT_RAPIDE.md pour plus de détails" -ForegroundColor Cyan 