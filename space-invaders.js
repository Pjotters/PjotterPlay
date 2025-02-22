class SpaceInvaders {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
        this.setupControls();
    }

    init() {
        // Game configuratie
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameOver = false;
        this.isPaused = false;

        // Speler schip
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            width: 50,
            height: 30,
            speed: 5
        };

        // Vijanden configuratie
        this.enemies = this.createEnemies();
        
        // Projectielen
        this.bullets = [];
        this.enemyBullets = [];
        
        // Power-ups
        this.powerUps = [];
        
        // Bewegingsrichting vijanden
        this.enemyDirection = 1;
        
        // Animatie frames
        this.lastTime = 0;
        this.enemyMoveTimer = 0;
    }

    createEnemies() {
        const enemies = [];
        const rows = 5;
        const cols = 10;
        const spacing = 60;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                enemies.push({
                    x: col * spacing + 50,
                    y: row * spacing + 50,
                    width: 40,
                    height: 40,
                    type: row, // Verschillende types vijanden
                    alive: true
                });
            }
        }
        return enemies;
    }

    update(deltaTime) {
        if (this.gameOver || this.isPaused) return;

        // Update speler
        if (this.keys.ArrowLeft) this.player.x -= this.player.speed;
        if (this.keys.ArrowRight) this.player.x += this.player.speed;
        
        // Houd speler binnen scherm
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));

        // Update vijanden
        this.updateEnemies(deltaTime);
        
        // Update kogels
        this.updateBullets();
        
        // Update power-ups
        this.updatePowerUps();
        
        // Collision detection
        this.checkCollisions();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Teken speler
        this.ctx.fillStyle = '#0f0';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Teken vijanden
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
                this.ctx.fillStyle = ['#f00', '#ff0', '#f0f'][enemy.type % 3];
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        });

        // Teken kogels
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(bullet.x, bullet.y, 3, 15);
        });
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    setupControls() {
        this.keys = {};
        
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') this.shoot();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.init();
            this.gameLoop(0);
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
        });
    }
}

// Start het spel
document.addEventListener('DOMContentLoaded', () => {
    const game = new SpaceInvaders();
}); 