# Script de déploiement CommuniConnect sur serveur gratuit
# Compatible avec Render, Railway, Heroku, Vercel, etc.

param(
    [string]$Platform = "render",
    [string]$MongoDBUri = "",
    [string]$Domain = ""
)

Write-Host "🚀 DÉPLOIEMENT COMMUNICONNECT - SERVEUR GRATUIT" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# 1. Vérification des prérequis
Write-Host "`n1️⃣ Vérification des prérequis..." -ForegroundColor Yellow

if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git n'est pas installé. Veuillez installer Git." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Veuillez installer Node.js." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prérequis vérifiés" -ForegroundColor Green

# 2. Configuration MongoDB Atlas
Write-Host "`n2️⃣ Configuration MongoDB Atlas..." -ForegroundColor Yellow

if ([string]::IsNullOrEmpty($MongoDBUri)) {
    $MongoDBUri = Read-Host "Entrez votre URI MongoDB Atlas"
}

if ([string]::IsNullOrEmpty($MongoDBUri)) {
    Write-Host "❌ URI MongoDB Atlas requis" -ForegroundColor Red
    exit 1
}

Write-Host "✅ URI MongoDB Atlas configuré" -ForegroundColor Green

# 3. Création du fichier .env.production
Write-Host "`n3️⃣ Configuration des variables d'environnement..." -ForegroundColor Yellow

$envContent = @"
# Configuration Production CommuniConnect
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGODB_URI=$MongoDBUri

# JWT
JWT_SECRET=communiconnect-production-secret-key-2024
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://$Domain

# Logs
LOG_LEVEL=info
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "✅ Fichier .env.production créé" -ForegroundColor Green

# 4. Préparation du déploiement selon la plateforme
Write-Host "`n4️⃣ Préparation du déploiement sur $Platform..." -ForegroundColor Yellow

switch ($Platform.ToLower()) {
    "render" {
        Write-Host "📋 Instructions pour Render.com:" -ForegroundColor Cyan
        Write-Host "1. Créez un compte sur render.com" -ForegroundColor White
        Write-Host "2. Connectez votre repository GitHub" -ForegroundColor White
        Write-Host "3. Créez un nouveau Web Service" -ForegroundColor White
        Write-Host "4. Configurez les variables d'environnement:" -ForegroundColor White
        Write-Host "   - MONGODB_URI: $MongoDBUri" -ForegroundColor White
        Write-Host "   - NODE_ENV: production" -ForegroundColor White
        Write-Host "   - JWT_SECRET: communiconnect-production-secret-key-2024" -ForegroundColor White
        Write-Host "5. Build Command: npm run build" -ForegroundColor White
        Write-Host "6. Start Command: npm start" -ForegroundColor White
    }
    "railway" {
        Write-Host "📋 Instructions pour Railway.app:" -ForegroundColor Cyan
        Write-Host "1. Créez un compte sur railway.app" -ForegroundColor White
        Write-Host "2. Connectez votre repository GitHub" -ForegroundColor White
        Write-Host "3. Créez un nouveau projet" -ForegroundColor White
        Write-Host "4. Configurez les variables d'environnement:" -ForegroundColor White
        Write-Host "   - MONGODB_URI: $MongoDBUri" -ForegroundColor White
        Write-Host "   - NODE_ENV: production" -ForegroundColor White
        Write-Host "   - JWT_SECRET: communiconnect-production-secret-key-2024" -ForegroundColor White
    }
    "vercel" {
        Write-Host "📋 Instructions pour Vercel:" -ForegroundColor Cyan
        Write-Host "1. Installez Vercel CLI: npm i -g vercel" -ForegroundColor White
        Write-Host "2. Connectez votre compte: vercel login" -ForegroundColor White
        Write-Host "3. Déployez: vercel --prod" -ForegroundColor White
        Write-Host "4. Configurez les variables d'environnement dans le dashboard" -ForegroundColor White
    }
    "heroku" {
        Write-Host "📋 Instructions pour Heroku:" -ForegroundColor Cyan
        Write-Host "1. Installez Heroku CLI" -ForegroundColor White
        Write-Host "2. Créez une app: heroku create your-app-name" -ForegroundColor White
        Write-Host "3. Configurez les variables: heroku config:set MONGODB_URI=$MongoDBUri" -ForegroundColor White
        Write-Host "4. Déployez: git push heroku main" -ForegroundColor White
    }
    default {
        Write-Host "📋 Instructions générales:" -ForegroundColor Cyan
        Write-Host "1. Configurez les variables d'environnement" -ForegroundColor White
        Write-Host "2. Déployez votre code" -ForegroundColor White
        Write-Host "3. Vérifiez que l'application fonctionne" -ForegroundColor White
    }
}

# 5. Création des fichiers de configuration
Write-Host "`n5️⃣ Création des fichiers de configuration..." -ForegroundColor Yellow

# Procfile pour Heroku
$procfileContent = "web: npm start"
$procfileContent | Out-File -FilePath "Procfile" -Encoding UTF8
Write-Host "✅ Procfile créé" -ForegroundColor Green

# vercel.json pour Vercel
$vercelConfig = @"
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
"@

$vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
Write-Host "✅ vercel.json créé" -ForegroundColor Green

# 6. Test local
Write-Host "`n6️⃣ Test local avant déploiement..." -ForegroundColor Yellow

Write-Host "🔧 Test de l'API..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API fonctionnelle" -ForegroundColor Green
    } else {
        Write-Host "⚠️ API accessible mais statut: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ API non accessible localement (normal si pas démarrée)" -ForegroundColor Yellow
}

# 7. Instructions finales
Write-Host "`n🎉 PRÊT POUR LE DÉPLOIEMENT !" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n📋 Étapes suivantes:" -ForegroundColor Cyan
Write-Host "1. Committez vos changements: git add . && git commit -m 'Deploy preparation'" -ForegroundColor White
Write-Host "2. Poussez vers GitHub: git push origin main" -ForegroundColor White
Write-Host "3. Suivez les instructions ci-dessus pour votre plateforme" -ForegroundColor White
Write-Host "4. Configurez les variables d'environnement sur votre plateforme" -ForegroundColor White
Write-Host "5. Déployez votre application" -ForegroundColor White

Write-Host "`n🔗 Votre application sera accessible sur:" -ForegroundColor Cyan
Write-Host "   - API: https://your-app-name.onrender.com/api" -ForegroundColor White
Write-Host "   - Client: https://your-app-name.onrender.com" -ForegroundColor White

Write-Host "`n✅ Déploiement préparé avec succès !" -ForegroundColor Green 