// Firebase configuratie en initialisatie
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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
    
    // Controleer eerst of het spel al bestaat
    const q = query(gamesRef, where('title', '==', 'Building your Factory'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        // Voeg het spel toe als het nog niet bestaat
        await addDoc(gamesRef, {
            title: 'Building your Factory',
            description: 'Bouw je eigen fabriek! Beheer grondstoffen, huur werknemers in en automatiseer productieprocessen in deze verslavende factory builder.',
            imageUrl: '/images/factory-game.png',
            genre: 'strategy',
            difficulty: 'medium',
            path: 'PjotterPlay/factory-game.html',
            features: ['Resource Management', 'Automatisering', 'Werknemers beheer'],
            lastUpdated: new Date().toISOString()
        });
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

// Games weergeven
async function displayGames() {
    try {
        if (!checkLogin()) return;
        
        const gamesRef = collection(db, 'games');
        const querySnapshot = await getDocs(gamesRef);
        
        const recommendedContainer = document.getElementById('recommendedGamesGrid');
        const allGamesContainer = document.getElementById('allGamesGrid');
        
        if (!recommendedContainer || !allGamesContainer) {
            console.error('Container elements not found');
            return;
        }

        const games = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Toon alle games in beide containers
        const gameCards = games.map(game => createGameCard(game)).join('');
        recommendedContainer.innerHTML = gameCards;
        allGamesContainer.innerHTML = gameCards;

    } catch (error) {
        console.error('Error fetching games:', error);
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