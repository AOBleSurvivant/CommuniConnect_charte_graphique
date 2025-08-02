// CORRECTION DES BOUTONS "NOUVELLE PUBLICATION" ET "RECHERCHE"

// 1. Modification de HomePageCommuniConnect.js
// Ajouter ces gestionnaires d'événements :

const handleCreateNewPost = () => {
  navigate('/feed', { state: { showCreatePost: true } });
};

const handleSearch = () => {
  navigate('/feed', { state: { showSearch: true } });
};

// Remplacer les boutons dans welcome-actions :
// <button className="btn btn-primary" onClick={handleCreateNewPost}>
// <button className="btn btn-outline" onClick={handleSearch}>

// 2. Modification de FeedPage.js
// Ajouter l'import :
import { useLocation } from 'react-router-dom';

// Ajouter dans le composant :
const location = useLocation();
const [showSearch, setShowSearch] = useState(false);

// Ajouter ce useEffect :
useEffect(() => {
  if (location.state) {
    if (location.state.showCreatePost) {
      setShowCreatePost(true);
    }
    if (location.state.showSearch) {
      setShowSearch(true);
    }
  }
}, [location.state]);

// 3. Ajouter un composant de recherche dans FeedPage.js
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <TextField
        fullWidth
        placeholder="Rechercher dans les publications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

// 4. Afficher le composant de recherche quand showSearch est true
{showSearch && <SearchComponent />} 