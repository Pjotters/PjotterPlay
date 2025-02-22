// Firebase configuratie en initialisatie
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBCXaYJI9dxwqKD1Qsb_9AOdsnVTPG2uHM",
    authDomain: "pjotters-company.firebaseapp.com",
    databaseURL: "https://pjotters-company-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pjotters-company",
    storageBucket: "pjotters-company.appspot.com",
    messagingSenderId: "64413422793",
    appId: "1:64413422793:web:4025770645944818d6e918"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Voeg deze functie toe na de bestaande Firebase configuratie
async function initializeGames() {
    const gamesRef = collection(db, 'games');
    
    const games = [
        {
            title: 'Building your Factory',
            description: 'Bouw je eigen fabriek! Beheer grondstoffen, huur werknemers in en automatiseer productieprocessen in deze verslavende factory builder.',
            imageUrl: '/images/factory-game.png',
            genre: 'strategy',
            difficulty: 'medium',
            path: 'PjotterPlay/factory-game.html',
            features: ['Resource Management', 'Automatisering', 'Werknemers beheer'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Minecraft Classic',
            description: 'Verken een oneindige wereld, bouw constructies en overleef in deze sandbox klassieker.',
            imageUrl: '/images/minecraft.png',
            genre: 'sandbox',
            difficulty: 'easy',
            path: 'PjotterPlay/minecraft.html',
            features: ['Bouwsysteem', 'Verkenning', 'Crafting', 'Survival'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Tetris Evolution',
            description: 'De klassieke puzzelgame in een modern jasje. Met nieuwe spelmodi en multiplayer opties.',
            imageUrl: '/images/tetris.png',
            genre: 'puzzle',
            difficulty: 'medium',
            path: 'PjotterPlay/tetris.html',
            features: ['Classic Mode', 'Battle Mode', 'Time Trial', 'Multiplayer'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Space Invaders 2.0',
            description: 'Verdedig de aarde tegen buitenaardse invasies in deze moderne versie van de arcade klassieker.',
            imageUrl: '/images/space-invaders.png',
            genre: 'arcade',
            difficulty: 'easy',
            path: 'PjotterPlay/space-invaders.html',
            features: ['Power-ups', 'Boss Battles', 'Achievements'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Super Mario Run',
            description: 'Help Mario door levels vol uitdagingen in deze endless runner versie van de bekende serie.',
            imageUrl: '/images/mario-run.png',
            genre: 'action',
            difficulty: 'easy',
            path: 'PjotterPlay/mario-run.html',
            features: ['Auto-run', 'Coin Collection', 'Level Editor'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Chess Master',
            description: 'Schaak tegen AI of andere spelers met geavanceerde tutorials en strategieën.',
            imageUrl: '/images/chess.png',
            genre: 'strategy',
            difficulty: 'hard',
            path: 'PjotterPlay/chess.html',
            features: ['AI Opponent', 'Online Multiplayer', 'Tutorial Mode'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Pac-Man Reloaded',
            description: 'De klassieke maze runner met nieuwe power-ups en moderne graphics.',
            imageUrl: '/images/pacman.png',
            genre: 'arcade',
            difficulty: 'medium',
            path: 'PjotterPlay/pacman.html',
            features: ['Classic Mode', 'New Power-ups', 'Custom Mazes'],
            lastUpdated: new Date().toISOString()
        },
        {
            title: 'Portal Puzzles',
            description: 'Los complexe puzzels op met portaal mechanica in deze hersenkraker.',
            imageUrl: '/images/portal.png',
            genre: 'puzzle',
            difficulty: 'hard',
            path: 'PjotterPlay/portal.html',
            features: ['Physics Based', 'Level Editor', 'Community Levels'],
            lastUpdated: new Date().toISOString()
        }
    ];

    // Check en voeg elke game toe
    for (const game of games) {
        const q = query(gamesRef, where('title', '==', game.title));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            await addDoc(gamesRef, game);
            console.log(`Added game: ${game.title}`);
        }
    }
}

// Gebruikersvoorkeuren ophalen
async function getUserPreferences() {
    // Als de gebruiker is ingelogd, haal voorkeuren op uit Firebase
    // Anders gebruik lokale opslag
    const preferences = localStorage.getItem('gamePreferences');
    return preferences ? JSON.parse(preferences) : {
        genres: [],
        difficulty: 'all'
    };
}

// Games ophalen op basis van filters
async function getFilteredGames(filters) {
    const gamesRef = collection(db, 'games');
    let q = query(gamesRef);

    if (filters.genres.length > 0) {
        q = query(q, where('genre', 'in', filters.genres));
    }
    if (filters.difficulty !== 'all') {
        q = query(q, where('difficulty', '==', filters.difficulty));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Game kaart HTML genereren
function createGameCard(game) {
    return `
        <div class="game-card">
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <div class="game-meta">
                    <span class="genre">${game.genre}</span>
                    <span class="difficulty">${game.difficulty}</span>
                </div>
            </div>
            <div class="game-actions">
                <a href="${game.path}" class="play-button">Speel nu</a>
            </div>
        </div>
    `;
}

// Voeg deze functie toe aan het begin van gallery.js
function checkLogin() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Voeg deze event listener toe voor de logout knop
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userLoggedIn');
    window.location.href = 'login.html';
});

// Voeg deze functie toe om de gebruikersnaam weer te geven
async function displayUsername() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const username = user.displayName;
            const welcomeMessage = document.querySelector('.game-description');
            if (welcomeMessage) {
                welcomeMessage.textContent = `Beste ${username}, hier kun je games spelen en bekijken.`;
            }
        }
    });
}

// Games weergeven
async function displayGames() {
    try {
        if (!checkLogin()) return;
        
        const gamesRef = collection(db, 'games');
        const querySnapshot = await getDocs(gamesRef);
        const allGamesContainer = document.getElementById('allGamesGrid');
        
        if (!allGamesContainer) {
            console.error('Games container not found');
            return;
        }

        const games = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const gameCards = games.map(game => `
            <div class="game-card" data-aos="fade-up">
                <div class="game-card-inner">
                    <div class="game-image-container">
                        <img src="${game.imageUrl}" alt="${game.title}" loading="lazy">
                        <div class="game-overlay">
                            <a href="${game.path}" class="play-button">Speel nu</a>
                        </div>
                    </div>
                    <div class="game-info">
                        <h3>${game.title}</h3>
                        <p>${game.description}</p>
                        <div class="game-meta">
                            <span class="genre">${game.genre}</span>
                            <span class="difficulty">${game.difficulty}</span>
                        </div>
                        <div class="game-features">
                            ${game.features.map(feature => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        allGamesContainer.innerHTML = gameCards;
        
        // Initialize AOS
        AOS.init({
            duration: 800,
            offset: 100,
            once: true
        });
    } catch (error) {
        console.error('Error displaying games:', error);
    }
}

// Event listeners
document.getElementById('applyFilters').addEventListener('click', async () => {
    const genreFilter = document.getElementById('genreFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    const filters = {
        genres: Array.from(genreFilter.selectedOptions).map(option => option.value),
        difficulty: difficultyFilter.value
    };
    
    const filteredGames = await getFilteredGames(filters);
    document.getElementById('allGamesGrid').innerHTML = 
        filteredGames.map(game => createGameCard(game)).join('');
});

// Initialize games en display ze
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await displayUsername();
        await initializeGames();
        await displayGames();
        
        // Voeg event listeners toe voor filters
        const applyFiltersButton = document.getElementById('applyFilters');
        if (applyFiltersButton) {
            applyFiltersButton.addEventListener('click', async () => {
                const genreFilter = document.getElementById('genreFilter');
                const difficultyFilter = document.getElementById('difficultyFilter');
                
                const filters = {
                    genres: Array.from(genreFilter.selectedOptions).map(option => option.value),
                    difficulty: difficultyFilter.value
                };
                
                const filteredGames = await getFilteredGames(filters);
                document.getElementById('allGamesGrid').innerHTML = 
                    filteredGames.map(game => createGameCard(game)).join('');
            });
        }
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }
}); 