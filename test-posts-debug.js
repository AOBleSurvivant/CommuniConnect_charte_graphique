const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function debugPosts() {
  try {
    // 1. Obtenir un token OAuth
    const oauthResponse = await axios.post(`${API_BASE_URL}/auth/oauth/callback`, {
      code: 'test-oauth-code',
      state: 'test-state',
      redirectUri: 'http://localhost:3000/auth/callback'
    });

    if (!oauthResponse.data.success) {
      console.error('❌ OAuth échoué');
      return;
    }

    const token = oauthResponse.data.token;
    console.log('✅ Token OAuth obtenu');

    // 2. Test simple de création de post
    try {
      const postResponse = await axios.post(`${API_BASE_URL}/posts`, {
        content: 'Test post simple',
        type: 'community',
        isPublic: true
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('✅ Post simple créé:', postResponse.data);
    } catch (error) {
      console.error('❌ Erreur post simple:', error.response?.data || error.message);
    }

    // 3. Test avec vidéo
    try {
      const postVideoResponse = await axios.post(`${API_BASE_URL}/posts`, {
        content: 'Test post avec vidéo',
        type: 'community',
        isPublic: true,
        media: [
          {
            filename: 'test-video.mp4',
            type: 'video/mp4',
            size: 1024000
          }
        ]
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('✅ Post avec vidéo créé:', postVideoResponse.data);
    } catch (error) {
      console.error('❌ Erreur post vidéo:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

debugPosts(); 