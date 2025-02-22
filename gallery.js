// Verwijder alle Firebase imports en configuratie
document.addEventListener('DOMContentLoaded', () => {
    // Statische game data
    const games = [
        {
            title: 'Building your Factory',
            description: 'Bouw je eigen fabriek! Beheer grondstoffen, huur werknemers in en automatiseer productieprocessen in deze verslavende factory builder.',
            imageUrl: 'images/factory-game.png',
            genre: 'strategy',
            difficulty: 'medium',
            path: 'factory-game.html',
            features: ['Resource Management', 'Automatisering', 'Werknemers beheer']
        },
        {
            title: 'Minecraft Classic',
            description: 'Verken een oneindige wereld, bouw constructies en overleef in deze sandbox klassieker.',
            imageUrl: 'images/minecraft.png',
            genre: 'sandbox',
            difficulty: 'easy',
            path: 'minecraft.html',
            features: ['Bouwsysteem', 'Verkenning', 'Crafting', 'Survival']
        }
    ];

    // Games weergeven
    const displayGames = () => {
        const allGamesContainer = document.getElementById('allGamesGrid');
        
        if (!allGamesContainer) {
            console.error('Games container not found');
            return;
        }

        const gameCards = games.map(game => `
            <div class="game-card" data-aos="fade-up">
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${game.imageUrl}" alt="${game.title}" style="width:100%; border-radius: 10px 10px 0 0;">
                        <h3>${game.title}</h3>
                    </div>
                    <div class="card-back">
                        <p>${game.description}</p>
                        <button class="play-button" onclick="window.location.href='${game.path}'">Start Game</button>
                    </div>
                </div>
            </div>
        `).join('');

        allGamesContainer.innerHTML = gameCards;
    };

    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });

    // Display games
    displayGames();

    // Logout functionaliteit
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
}); 