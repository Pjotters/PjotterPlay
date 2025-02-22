class Checkers {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = 50;
        this.init();
        this.setupControls();
    }

    init() {
        this.board = this.createBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.scores = { white: 0, black: 0 };
        this.render();
    }

    createBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Plaats witte stukken
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { color: 'white', isKing: false };
                }
            }
        }
        
        // Plaats zwarte stukken
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { color: 'black', isKing: false };
                }
            }
        }
        
        return board;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) return [];

        const moves = [];
        const directions = piece.isKing ? [-1, 1] : piece.color === 'white' ? [1] : [-1];

        directions.forEach(dRow => {
            [-1, 1].forEach(dCol => {
                // Normale zet
                let newRow = row + dRow;
                let newCol = col + dCol;
                if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                    moves.push({ row: newRow, col: newCol, isJump: false });
                }

                // Sprong over tegenstander
                newRow = row + dRow * 2;
                newCol = col + dCol * 2;
                if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                    const jumpedRow = row + dRow;
                    const jumpedCol = col + dCol;
                    const jumpedPiece = this.board[jumpedRow][jumpedCol];
                    if (jumpedPiece && jumpedPiece.color !== piece.color) {
                        moves.push({ 
                            row: newRow, 
                            col: newCol, 
                            isJump: true,
                            jumpedRow,
                            jumpedCol 
                        });
                    }
                }
            });
        });

        return moves;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const move = this.validMoves.find(m => m.row === toRow && m.col === toCol);
        if (!move) return false;

        const piece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Verwijder gesprongen stuk
        if (move.isJump) {
            this.board[move.jumpedRow][move.jumpedCol] = null;
            this.scores[this.currentPlayer]++;
        }

        // Maak dam
        if ((piece.color === 'white' && toRow === 7) || 
            (piece.color === 'black' && toRow === 0)) {
            piece.isKing = true;
        }

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.selectedPiece = null;
        this.validMoves = [];
        
        this.updateScores();
        this.render();
        return true;
    }

    render() {
        // Teken bord
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.ctx.fillStyle = (row + col) % 2 === 0 ? '#EEEED2' : '#769656';
                this.ctx.fillRect(col * this.squareSize, row * this.squareSize, 
                                this.squareSize, this.squareSize);
                
                // Teken stuk
                const piece = this.board[row][col];
                if (piece) {
                    this.drawPiece(row, col, piece);
                }
            }
        }

        // Teken geldige zetten
        this.validMoves.forEach(move => {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(
                (move.col + 0.5) * this.squareSize,
                (move.row + 0.5) * this.squareSize,
                this.squareSize * 0.3,
                0, Math.PI * 2
            );
            this.ctx.fill();
        });
    }

    setupControls() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const col = Math.floor(x / this.squareSize);
            const row = Math.floor(y / this.squareSize);

            if (this.selectedPiece) {
                const move = this.validMoves.find(m => m.row === row && m.col === col);
                if (move) {
                    this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
                }
                this.selectedPiece = null;
                this.validMoves = [];
            } else {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    this.selectedPiece = { row, col };
                    this.validMoves = this.getValidMoves(row, col);
                }
            }
            this.render();
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.init();
        });

        document.getElementById('undoBtn').addEventListener('click', () => {
            if (this.moveHistory.length > 0) {
                const lastMove = this.moveHistory.pop();
                // Implementeer undo logica
            }
        });
    }
}

// Start het spel
document.addEventListener('DOMContentLoaded', () => {
    const game = new Checkers();
}); 