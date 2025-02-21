// Firebase configuratie en initialisatie
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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
            <img src="${game.imageUrl}" alt="${game.title}" class="game-image">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-meta">
                    <span>${game.genre}</span>
                    <span>${game.difficulty}</span>
                </div>
            </div>
        </div>
    `;
}

// Voeg deze functie toe aan het begin van gallery.js
function checkLogin() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Games weergeven
async function displayGames() {
    if (!checkLogin()) return;
    
    const preferences = await getUserPreferences();
    const recommendedGames = await getFilteredGames(preferences);
    
    const recommendedContainer = document.getElementById('recommendedGamesGrid');
    recommendedContainer.innerHTML = recommendedGames
        .map(game => createGameCard(game))
        .join('');
}

// Event listeners
document.getElementById('applyFilters').addEventListener('click', async () => {
    const genres = Array.from(document.getElementById('genreFilter').selectedOptions)
        .map(option => option.value);
    const difficulty = document.getElementById('difficultyFilter').value;

    const preferences = { genres, difficulty };
    localStorage.setItem('gamePreferences', JSON.stringify(preferences));
    
    await displayGames();
});

// Initialisatie
document.addEventListener('DOMContentLoaded', displayGames); 