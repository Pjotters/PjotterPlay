class MarioRun {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
        this.setupControls();
        this.loadAssets();
    }

    init() {
        this.score = 0;
        this.coins = 0;
        this.distance = 0;
        this.gameOver = false;
        this.isPaused = false;

        // Mario eigenschappen
        this.mario = {
            x: 100,
            y: this.canvas.height - 100,
            width: 50,
            height: 50,
            velocityY: 0,
            isJumping: false,
            jumpForce: -15,
            gravity: 0.8
        };

        // Platform generatie
        this.platforms = [];
        this.generateInitialPlatforms();

        // Collectibles
        this.coins = [];
        this.powerUps = [];

        // Game snelheid
        this.gameSpeed = 5;
        this.backgroundOffset = 0;
    }

    loadAssets() {
        // Laad sprites en achtergronden
        this.sprites = {
            mario: new Image(),
            coin: new Image(),
            platform: new Image(),
            background: new Image()
        };

        this.sprites.mario.src = 'images/mario-sprites.png';
        this.sprites.coin.src = 'images/coin.png';
        this.sprites.platform.src = 'images/platform.png';
        this.sprites.background.src = 'images/mario-background.png';
    }

    generateInitialPlatforms() {
        // Genereer beginplatforms
        for (let i = 0; i < 5; i++) {
            this.platforms.push({
                x: i * 200,
                y: this.canvas.height - 50,
                width: 200,
                height: 20
            });
        }
    }

    update() {
        if (this.gameOver || this.isPaused) return;

        // Update Mario's positie
        this.mario.velocityY += this.mario.gravity;
        this.mario.y += this.mario.velocityY;

        // Check platform collisions
        this.checkPlatformCollisions();

        // Update platforms en collectibles
        this.updatePlatforms();
        this.updateCollectibles();

        // Update score en afstand
        this.distance += this.gameSpeed / 60;
        this.score = Math.floor(this.distance) + (this.coins * 10);
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Teken achtergrond
        this.drawBackground();

        // Teken platforms
        this.platforms.forEach(platform => {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Teken Mario
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.mario.x, this.mario.y, this.mario.width, this.mario.height);

        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('coins').textContent = this.coins;
        document.getElementById('distance').textContent = Math.floor(this.distance);
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.mario.isJumping) {
                this.mario.velocityY = this.mario.jumpForce;
                this.mario.isJumping = true;
            }
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.init();
            this.gameLoop();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
        });
    }
}

// Start het spel
document.addEventListener('DOMContentLoaded', () => {
    const game = new MarioRun();
}); 