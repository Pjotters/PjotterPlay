class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextPiece');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.init();
        this.setupControls();
    }

    init() {
        // Game configuratie
        this.grid = Array(20).fill().map(() => Array(10).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        
        // Tetromino's
        this.pieces = {
            I: [[1,1,1,1]],
            O: [[1,1],[1,1]],
            T: [[0,1,0],[1,1,1]],
            S: [[0,1,1],[1,1,0]],
            Z: [[1,1,0],[0,1,1]],
            J: [[1,0,0],[1,1,1]],
            L: [[0,0,1],[1,1,1]]
        };
        
        this.colors = {
            I: '#00f0f0',
            O: '#f0f000',
            T: '#a000f0',
            S: '#00f000',
            Z: '#f00000',
            J: '#0000f0',
            L: '#f0a000'
        };
        
        this.currentPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece();
        this.piecePos = {x: 3, y: 0};
    }

    // Game loop en rendering logica
    gameLoop() {
        if (!this.isPaused && !this.gameOver) {
            this.update();
            this.render();
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Game update logica
    }

    render() {
        // Rendering logica
    }

    // Piece beweging en rotatie
    movePiece(dx, dy) {
        // Bewegingslogica
    }

    rotatePiece() {
        // Rotatielogica
    }

    // Collision detection
    checkCollision(piece, pos) {
        // Collision check logica
    }

    // Line clearing
    checkLines() {
        // Line clearing logica
    }

    // Game controls
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameOver) {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.movePiece(-1, 0);
                        break;
                    case 'ArrowRight':
                        this.movePiece(1, 0);
                        break;
                    case 'ArrowDown':
                        this.movePiece(0, 1);
                        break;
                    case 'ArrowUp':
                        this.rotatePiece();
                        break;
                    case ' ':
                        this.hardDrop();
                        break;
                    case 'p':
                        this.togglePause();
                        break;
                }
            }
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.init();
            this.gameLoop();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
    }
}

// Start het spel
document.addEventListener('DOMContentLoaded', () => {
    const game = new TetrisGame();
}); 