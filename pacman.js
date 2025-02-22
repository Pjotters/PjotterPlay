class PacMan {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 16;
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

        // Pac-Man eigenschappen
        this.pacman = {
            x: 14 * this.tileSize,
            y: 23 * this.tileSize,
            direction: 'right',
            nextDirection: 'right',
            speed: 2,
            mouthOpen: 0,
            mouthSpeed: 0.15
        };

        // Spookjes
        this.ghosts = this.createGhosts();
        
        // Level layout
        this.maze = this.createMaze();
        
        // Dots en power pellets
        this.dots = this.createDots();
        this.powerPellets = this.createPowerPellets();
        
        // Power-up status
        this.powerMode = false;
        this.powerTimer = 0;
    }

    createMaze() {
        // 28x31 doolhof layout (1 = muur, 0 = pad)
        return [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            // ... meer maze data
        ];
    }

    createGhosts() {
        return [
            {
                x: 13 * this.tileSize,
                y: 11 * this.tileSize,
                color: '#ff0000', // Blinky
                speed: 2,
                mode: 'scatter'
            },
            // ... meer spookjes
        ];
    }

    update() {
        if (this.gameOver || this.isPaused) return;

        this.updatePacman();
        this.updateGhosts();
        this.checkCollisions();
        this.updatePowerMode();
    }

    updatePacman() {
        // Update Pac-Man positie en animatie
        this.pacman.mouthOpen += this.pacman.mouthSpeed;
        if (this.pacman.mouthOpen > 0.5 || this.pacman.mouthOpen < 0) {
            this.pacman.mouthSpeed *= -1;
        }

        // Beweging en collision detection
        const nextX = this.pacman.x + this.getDirectionVector().x * this.pacman.speed;
        const nextY = this.pacman.y + this.getDirectionVector().y * this.pacman.speed;

        if (this.canMove(nextX, nextY)) {
            this.pacman.x = nextX;
            this.pacman.y = nextY;
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Teken doolhof
        this.renderMaze();
        
        // Teken dots en power pellets
        this.renderDots();
        this.renderPowerPellets();
        
        // Teken Pac-Man
        this.renderPacman();
        
        // Teken spookjes
        this.renderGhosts();
    }

    gameLoop(timestamp) {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.pacman.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    this.pacman.nextDirection = 'right';
                    break;
                case 'ArrowUp':
                    this.pacman.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    this.pacman.nextDirection = 'down';
                    break;
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
    const game = new PacMan();
}); 