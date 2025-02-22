// Verwijder alle Firebase imports en configuratie
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });

    // Logout functionaliteit
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    // Game cards hover effect
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        });
    });
}); 