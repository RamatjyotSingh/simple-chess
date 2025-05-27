class Game {
    constructor() {
        this.board = new ChessBoard();
        this.isPlayerTurn = true;
        this.isPlayerHuman = true; // Player is white
        this.difficulty = 1;
        this.moveHistory = [];
        this.statusElement = document.getElementById('status');
        this.historyContentElement = document.getElementById('history-content');
        
        // Initialize game
        this.init();
    }
    
    init() {
        this.board.reset();
        this.isPlayerTurn = true;
        this.moveHistory = [];
        this.updateStatus();
        this.updateMoveHistory();
        
        // Set up event listeners
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.difficulty = parseInt(e.target.value);
        });
    }
    
    newGame() {
        this.board.reset();
        this.isPlayerTurn = true;
        this.moveHistory = [];
        this.updateStatus();
        this.updateMoveHistory();
    }
    
    makeMove(move) {
        const fromRow = move.currRow - 1;
        const fromCol = move.currColumn - 1;
        const toRow = move.nextRow - 1;
        const toCol = move.nextColumn - 1;
        
        const piece = this.board.getPiece(move.currRow, move.currColumn);
        if (!piece) return false;
        
        // Check for pawn promotion
        let isPromotion = false;
        if (piece instanceof Pawn) {
            if ((piece.isHuman && toRow === 0) || (!piece.isHuman && toRow === 7)) {
                isPromotion = true;
            }
        }
        
        // Move the piece
        const capturedPiece = this.board.move(piece, toRow, toCol);
        
        // Handle promotion
        if (isPromotion) {
            this.handlePromotion(piece);
        }
        
        // Add to move history
        this.moveHistory.push({
            move: move,
            piece: piece.constructor.name,
            isHuman: piece.isHuman,
            captured: capturedPiece ? capturedPiece.constructor.name : null
        });
        
        // Update UI
        this.updateStatus();
        this.updateMoveHistory();
        
        // Check for game end
        if (capturedPiece instanceof King) {
            this.endGame(piece.isHuman);
            return true;
        }
        
        // Switch turns
        this.isPlayerTurn = !this.isPlayerTurn;
        
        // If it's AI's turn, make AI move
        if (!this.isPlayerTurn) {
            setTimeout(() => this.makeAIMove(), 500);
        }
        
        return true;
    }
    
    makeAIMove() {
        // Implement simple AI based on difficulty
        if (this.difficulty === 1) {
            this.makeRandomMove();
        } else {
            this.makeSmartMove();
        }
    }
    
    makeRandomMove() {
        const aiPieces = [];
        
        // Collect all AI pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board.squares[row][col];
                if (piece && !piece.isHuman) {
                    aiPieces.push({piece, row, col});
                }
            }
        }
        
        // Randomize piece selection
        aiPieces.sort(() => 0.5 - Math.random());
        
        // Try each piece until a valid move is found
        for (const {piece, row, col} of aiPieces) {
            const validMoves = [];
            
            // Find all valid moves for the piece
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (piece.validateRange(r + 1, c + 1, this.board)) {
                        validMoves.push({row: r, col: c});
                    }
                }
            }
            
            // If valid moves exist, choose one randomly
            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                const chessMove = new Move(row + 1, col + 1, move.row + 1, move.col + 1);
                this.makeMove(chessMove);
                return;
            }
        }
        
        // If no valid moves were found
        this.endGame(true);
    }
    
    makeSmartMove() {
        const aiPieces = [];
        const humanPieces = [];
        let bestMove = null;
        let bestScore = -Infinity;
        
        // Collect all pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board.squares[row][col];
                if (piece) {
                    if (piece.isHuman) {
                        humanPieces.push({piece, row, col});
                    } else {
                        aiPieces.push({piece, row, col});
                    }
                }
            }
        }
        
        // First priority: try to capture the human's king
        for (const {piece, row, col} of aiPieces) {
            for (const {piece: humanPiece, row: humanRow, col: humanCol} of humanPieces) {
                if (humanPiece instanceof King && piece.validateRange(humanRow + 1, humanCol + 1, this.board)) {
                    const move = new Move(row + 1, col + 1, humanRow + 1, humanCol + 1);
                    this.makeMove(move);
                    return;
                }
            }
        }
        
        // Second priority: try to capture any piece with the highest value
        const pieceValues = {
            'Pawn': 1,
            'Knight': 3,
            'Bishop': 3,
            'Rook': 5,
            'Queen': 9,
            'King': 100
        };
        
        for (const {piece, row, col} of aiPieces) {
            for (const {piece: humanPiece, row: humanRow, col: humanCol} of humanPieces) {
                if (piece.validateRange(humanRow + 1, humanCol + 1, this.board)) {
                    const moveScore = pieceValues[humanPiece.constructor.name];
                    if (moveScore > bestScore) {
                        bestScore = moveScore;
                        bestMove = new Move(row + 1, col + 1, humanRow + 1, humanCol + 1);
                    }
                }
            }
        }
        
        // If a good capture was found, make that move
        if (bestMove) {
            this.makeMove(bestMove);
            return;
        }
        
        // Fallback: make a random move
        this.makeRandomMove();
    }
    
    handlePromotion(piece) {
        // In a real implementation, show a dialog to select promotion piece
        // For simplicity, always promote to a queen
        const row = piece.row;
        const col = piece.col;
        const isHuman = piece.isHuman;
        
        // Replace pawn with queen
        const queen = new Queen(isHuman);
        this.board.placePiece(queen, row, col);
    }
    
    updateStatus() {
        this.statusElement.textContent = this.isPlayerTurn ? "Your turn" : "AI is thinking...";
    }
    
    updateMoveHistory() {
        this.historyContentElement.innerHTML = '';
        
        for (let i = 0; i < this.moveHistory.length; i++) {
            const moveData = this.moveHistory[i];
            const moveNumber = Math.floor(i / 2) + 1;
            const moveText = document.createElement('div');
            moveText.className = 'history-move';
            
            let text = '';
            if (i % 2 === 0) {
                text += `${moveNumber}. `;
            }
            
            text += `${moveData.piece} ${moveData.move.toString()}`;
            if (moveData.captured) {
                text += ` (captured ${moveData.captured})`;
            }
            
            moveText.textContent = text;
            this.historyContentElement.appendChild(moveText);
        }
        
        // Scroll to bottom
        this.historyContentElement.scrollTop = this.historyContentElement.scrollHeight;
    }
    
    endGame(humanWon) {
        this.isPlayerTurn = false;
        
        if (humanWon) {
            this.statusElement.textContent = "Game over - You win!";
            alert("Congratulations! You win!");
        } else {
            this.statusElement.textContent = "Game over - AI wins!";
            alert("AI wins! Better luck next time.");
        }
    }
}

// Initialize game when the page loads
window.onload = () => {
    window.game = new Game();
};