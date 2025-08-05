const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Configuration MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/communiconnect?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Atlas connecté:', conn.connection.host);
    global.mongoConnected = true;
    
    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB Atlas:', error.message);
    global.mongoConnected = false;
    
    // En mode développement, continuer sans MongoDB
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Mode développement: continuation sans base de données');
      return null;
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 