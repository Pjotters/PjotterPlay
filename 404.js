class FlappyBird {
    constructor() {
        // Canvas setup
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 600;
        document.querySelector('.game-container').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameStarted = false;
        this.score = 0;
        
        // Bird setup
        this.bird = {
            x: 50,
            y: this.canvas.height / 2,
            velocity: 0,
            gravity: 0.5,
            jumpForce: -8,
            size: 20
        };
        
        this.pipes = [];
        
        // Direct de controls setup starten
        this.setupControls();
        
        // Start de game loop
        requestAnimationFrame(() => this.gameLoop());
        
        // Score display updaten
        this.updateScore();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameStarted) {
                    this.gameStarted = true;
                }
                this.bird.velocity = this.bird.jumpForce;
            }
        });
    }
    
    gameLoop() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameStarted) {
            // Update bird
            this.bird.velocity += this.bird.gravity;
            this.bird.y += this.bird.velocity;
            
            // Generate pipes
            if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < 250) {
                this.addPipe();
            }
            
            // Update and draw pipes
            this.updatePipes();
        }
        
        // Draw bird
        this.ctx.fillStyle = '#4B0082';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Check collisions
        if (this.checkCollision()) {
            this.resetGame();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    addPipe() {
        const gap = 150;
        const minHeight = 50;
        const maxHeight = this.canvas.height - gap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomHeight: topHeight + gap,
            width: 50,
            counted: false
        });
    }
    
    updatePipes() {
        for (let pipe of this.pipes) {
            pipe.x -= 2;
            
            // Draw pipes
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            this.ctx.fillRect(pipe.x, pipe.bottomHeight, pipe.width, this.canvas.height - pipe.bottomHeight);
            
            // Score update
            if (!pipe.counted && pipe.x < this.bird.x) {
                this.score++;
                pipe.counted = true;
                this.updateScore();
            }
        }
        
        // Remove off-screen pipes
        this.pipes = this.pipes.filter(pipe => pipe.x > -50);
    }
    
    checkCollision() {
        // Ground/ceiling collision
        if (this.bird.y < 0 || this.bird.y > this.canvas.height) {
            return true;
        }
        
        // Pipe collision
        return this.pipes.some(pipe => {
            return this.bird.x + this.bird.size > pipe.x &&
                   this.bird.x - this.bird.size < pipe.x + pipe.width &&
                   (this.bird.y - this.bird.size < pipe.topHeight ||
                    this.bird.y + this.bird.size > pipe.bottomHeight);
        });
    }
    
    resetGame() {
        this.gameStarted = false;
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        this.pipes = [];
        this.score = 0;
        this.updateScore();
    }
    
    updateScore() {
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }
}

// Start de game wanneer de pagina laadt
window.addEventListener('load', () => {
    new FlappyBird();
}); 