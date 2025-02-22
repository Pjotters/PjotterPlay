class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game objecten
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 5
        };
        
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        
        this.player1 = {
            y: (this.canvas.height - this.paddleHeight) / 2,
            score: 0,
            speed: 7
        };
        
        this.player2 = {
            y: (this.canvas.height - this.paddleHeight) / 2,
            score: 0,
            speed: 7
        };
        
        this.keys = {};
        this.gameLoop = null;
        this.isPaused = false;
        
        this.setupControls();
        this.setupButtons();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    setupButtons() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    }
    
    update() {
        if (this.isPaused) return;
        
        // Paddle beweging
        if (this.keys['w'] && this.player1.y > 0) {
            this.player1.y -= this.player1.speed;
        }
        if (this.keys['s'] && this.player1.y < this.canvas.height - this.paddleHeight) {
            this.player1.y += this.player1.speed;
        }
        
        if (this.keys['ArrowUp'] && this.player2.y > 0) {
            this.player2.y -= this.player2.speed;
        }
        if (this.keys['ArrowDown'] && this.player2.y < this.canvas.height - this.paddleHeight) {
            this.player2.y += this.player2.speed;
        }
        
        // Bal beweging
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Muur collisions
        if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
            this.ball.speedY = -this.ball.speedY;
        }
        
        // Paddle collisions
        if (this.checkPaddleCollision(this.player1, 20) || 
            this.checkPaddleCollision(this.player2, this.canvas.width - 30)) {
            this.ball.speedX = -this.ball.speedX * 1.1; // Verhoog snelheid na hit
        }
        
        // Score check
        if (this.ball.x < 0) {
            this.player2.score++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.x > this.canvas.width) {
            this.player1.score++;
            this.updateScore();
            this.resetBall();
        }
        
        this.draw();
    }
    
    checkPaddleCollision(player, paddleX) {
        return this.ball.x > paddleX - this.ball.radius && 
               this.ball.x < paddleX + this.paddleWidth + this.ball.radius &&
               this.ball.y > player.y &&
               this.ball.y < player.y + this.paddleHeight;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Teken middenlijn
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = '#fff';
        this.ctx.stroke();
        
        // Teken paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(20, this.player1.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - 30, this.player2.y, this.paddleWidth, this.paddleHeight);
        
        // Teken bal
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    startGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        this.resetGame();
        this.gameLoop = setInterval(() => this.update(), 1000/60);
    }
    
    resetGame() {
        this.player1.score = 0;
        this.player2.score = 0;
        this.updateScore();
        this.resetBall();
        this.player1.y = (this.canvas.height - this.paddleHeight) / 2;
        this.player2.y = (this.canvas.height - this.paddleHeight) / 2;
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speedX = (Math.random() > 0.5 ? 5 : -5);
        this.ball.speedY = (Math.random() > 0.5 ? 5 : -5);
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? 'Hervatten' : 'Pauze';
    }
    
    updateScore() {
        document.getElementById('player1Score').textContent = this.player1.score;
        document.getElementById('player2Score').textContent = this.player2.score;
    }
}

// Start het spel wanneer de pagina laadt
window.onload = () => {
    new PongGame();
}; 