class ChessBoard {
    constructor() {
        this.squares = Array(8).fill().map(() => Array(8).fill(null));
        this.element = document.getElementById('board');
        this.selectedPiece = null;
        this.validMoves = [];
        this.createBoard();
    }

    createBoard() {
        this.element.innerHTML = '';
        
        // Create squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                square.addEventListener('click', (e) => this.handleSquareClick(row, col));
                this.element.appendChild(square);
            }
        }
    }

    placePiece(piece, row, col) {
        this.squares[row][col] = piece;
        
        if (piece) {
            piece.row = row;
            piece.col = col;
            this.updateBoardDisplay();
        }
    }

    updateBoardDisplay() {
        // Clear all pieces from the display
        const pieceElements = document.querySelectorAll('.piece');
        pieceElements.forEach(el => el.remove());
        
        // Add pieces to their new positions
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece) {
                    const square = this.getSquareElement(row, col);
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece.isHuman ? 'white-piece' : 'black-piece'}`;
                    pieceElement.textContent = piece.getSymbol();
                    square.appendChild(pieceElement);
                }
            }
        }
    }

    getSquareElement(row, col) {
        return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    }

    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected');
            square.classList.remove('valid-move');
        });
    }

    highlightValidMoves(piece) {
        this.clearHighlights();
        
        // Highlight the selected piece
        const square = this.getSquareElement(piece.row, piece.col);
        square.classList.add('selected');
        
        // Find valid moves
        this.validMoves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (piece.validateRange(row + 1, col + 1, this)) {
                    this.validMoves.push({row, col});
                    this.getSquareElement(row, col).classList.add('valid-move');
                }
            }
        }
    }

    handleSquareClick(row, col) {
        const game = window.game; // Reference to the Game instance
        
        if (!game.isPlayerTurn) return;
        
        const piece = this.squares[row][col];
        
        // If a piece is already selected
        if (this.selectedPiece) {
            // If clicking on the same piece, deselect it
            if (this.selectedPiece === piece) {
                this.selectedPiece = null;
                this.clearHighlights();
                return;
            }
            
            // Check if this is a valid move
            const validMove = this.validMoves.find(move => move.row === row && move.col === col);
            
            if (validMove) {
                // Create a Move object (using +1 because the game logic uses 1-based indices)
                const move = new Move(
                    this.selectedPiece.row + 1,
                    this.selectedPiece.col + 1,
                    row + 1,
                    col + 1
                );
                
                // Execute the move
                game.makeMove(move);
                
                // Reset selection
                this.selectedPiece = null;
                this.clearHighlights();
                return;
            }
        }
        
        // If selecting a piece for the first time
        if (piece && piece.isHuman === game.isPlayerHuman) {
            this.selectedPiece = piece;
            this.highlightValidMoves(piece);
        }
    }

    // Method to check if a piece exists at given coordinates
    getPiece(row, col) {
        // Convert 1-based to 0-based
        const r = row - 1;
        const c = col - 1;
        
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            return this.squares[r][c];
        }
        return null;
    }

    // Method to move a piece
    move(piece, toRow, toCol) {
        // Remove piece from old position
        this.squares[piece.row][piece.col] = null;
        
        // Capture any piece at the destination
        const capturedPiece = this.squares[toRow][toCol];
        
        // Place piece at new position
        this.squares[toRow][toCol] = piece;
        piece.row = toRow;
        piece.col = toCol;
        
        // Update display
        this.updateBoardDisplay();
        
        return capturedPiece;
    }

    // Reset the board to starting position
    reset() {
        // Clear the board
        this.squares = Array(8).fill().map(() => Array(8).fill(null));
        
        // Place pieces
        // Black pieces (row 0)
        this.placePiece(new Rook(false), 0, 0);
        this.placePiece(new Knight(false), 0, 1);
        this.placePiece(new Bishop(false), 0, 2);
        this.placePiece(new Queen(false), 0, 3);
        this.placePiece(new King(false), 0, 4);
        this.placePiece(new Bishop(false), 0, 5);
        this.placePiece(new Knight(false), 0, 6);
        this.placePiece(new Rook(false), 0, 7);
        
        // Black pawns (row 1)
        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn(false), 1, i);
        }
        
        // White pawns (row 6)
        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn(true), 6, i);
        }
        
        // White pieces (row 7)
        this.placePiece(new Rook(true), 7, 0);
        this.placePiece(new Knight(true), 7, 1);
        this.placePiece(new Bishop(true), 7, 2);
        this.placePiece(new Queen(true), 7, 3);
        this.placePiece(new King(true), 7, 4);
        this.placePiece(new Bishop(true), 7, 5);
        this.placePiece(new Knight(true), 7, 6);
        this.placePiece(new Rook(true), 7, 7);
        
        // Update display
        this.updateBoardDisplay();
    }
}

// Move class to keep compatibility with the original Java code
class Move {
    constructor(currRow, currColumn, nextRow, nextColumn) {
        this.currRow = currRow;
        this.currColumn = currColumn;
        this.nextRow = nextRow;
        this.nextColumn = nextColumn;
    }
    
    // Used for displaying move history
    toString() {
        const files = 'abcdefgh';
        const ranks = '87654321';
        
        const from = files[this.currColumn - 1] + ranks[this.currRow - 1];
        const to = files[this.nextColumn - 1] + ranks[this.nextRow - 1];
        
        return `${from} to ${to}`;
    }
}