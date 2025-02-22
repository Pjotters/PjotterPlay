class FlappyBird {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 600;
        document.querySelector('.game-container').appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        this.bird = {
            x: 50,
            y: 300,
            velocity: 0,
            gravity: 0.5,
            jumpForce: -8,
            size: 20
        };
        
        this.pipes = [];
        this.score = 0;
        this.gameStarted = false;
        
        this.setupControls();
        this.animate();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Voorkom scrollen
                if (!this.gameStarted) {
                    this.gameStarted = true;
                }
                this.bird.velocity = this.bird.jumpForce;
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update bird
        if (this.gameStarted) {
            this.bird.velocity += this.bird.gravity;
            this.bird.y += this.bird.velocity;
            
            // Add pipes
            if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < 250) {
                this.addPipe();
            }
            
            // Update pipes
            this.pipes.forEach(pipe => {
                pipe.x -= 2;
            });
            
            // Remove off-screen pipes
            this.pipes = this.pipes.filter(pipe => pipe.x > -50);
            
            // Check collisions
            if (this.checkCollision()) {
                this.resetGame();
            }
        }
        
        // Draw everything
        this.draw();
        
        // Update score display
        document.querySelector('.score').textContent = `Score: ${this.score}`;
        
        requestAnimationFrame(() => this.animate());
    }
    
    draw() {
        // Draw bird
        this.ctx.fillStyle = '#4B0082';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw pipes
        this.ctx.fillStyle = '#32CD32';
        this.pipes.forEach(pipe => {
            this.ctx.fillRect(pipe.x, 0, 50, pipe.top);
            this.ctx.fillRect(pipe.x, pipe.bottom, 50, this.canvas.height - pipe.bottom);
        });
    }
    
    addPipe() {
        const gap = 200;
        const minHeight = 50;
        const maxHeight = this.canvas.height - gap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            top: topHeight,
            bottom: topHeight + gap
        });
    }
    
    checkCollision() {
        return this.bird.y < 0 || this.bird.y > this.canvas.height || 
               this.pipes.some(pipe => {
                   return this.bird.x + this.bird.size > pipe.x && 
                          this.bird.x - this.bird.size < pipe.x + 50 && 
                          (this.bird.y - this.bird.size < pipe.top || 
                           this.bird.y + this.bird.size > pipe.bottom);
               });
    }
    
    resetGame() {
        this.bird.y = 300;
        this.bird.velocity = 0;
        this.pipes = [];
        this.gameStarted = false;
        this.score = 0;
    }
}

// Start de game wanneer de pagina laadt
window.addEventListener('load', () => {
    new FlappyBird();
}); 