class ChessPiece {
    constructor(isHuman) {
        this.isHuman = isHuman; // true for white (human), false for black (AI)
        this.row = -1;
        this.col = -1;
    }
    
    // Method to validate if a move is within range
    validateRange(x, y, board) {
        // Abstract method to be implemented by subclasses
        throw new Error("Method validateRange must be implemented");
    }
    
    // Method to check if a piece can capture at given position
    canCapture(x, y, board) {
        const targetPiece = board.getPiece(x, y);
        return this.validateRange(x, y, board) && 
               targetPiece !== null && 
               targetPiece.isHuman !== this.isHuman;
    }
    
    // Get Unicode symbol for piece
    getSymbol() {
        // To be overridden by subclasses
        return '';
    }
}

class Pawn extends ChessPiece {
    constructor(isHuman) {
        super(isHuman);
    }
    
    validateRange(x, y, board) {
        const targetPiece = board.getPiece(x, y);
        
        // If there's a piece at target position, check if it can be captured
        if (targetPiece !== null) {
            return this.canCapture(x, y, board);
        }
        
        // Adjust move direction based on piece color (human/AI)
        const moveDirection = this.isHuman ? -1 : 1;
        const startingRow = this.isHuman ? 7 : 2;
        
        // Regular one-square move
        if (x === this.row + 1 + moveDirection && y === this.col + 1) {
            return true;
        }
        
        // First move can be two squares
        if (this.row + 1 === startingRow && 
            x === this.row + 1 + (2 * moveDirection) && 
            y === this.col + 1 && 
            board.getPiece(this.row + 1 + moveDirection + 1, this.col + 1) === null) {
            return true;
        }
        
        return false;
    }
    
    canCapture(x, y, board) {
        const targetPiece = board.getPiece(x, y);
        if (targetPiece === null) return false;
        
        const moveDirection = this.isHuman ? -1 : 1;
        
        return targetPiece.isHuman !== this.isHuman &&
               x === this.row + 1 + moveDirection &&
               (y === this.col || y === this.col + 2);
    }
    
    getSymbol() {
        return this.isHuman ? '♙' : '♟';
    }
}

class Rook extends ChessPiece {
    constructor(isHuman) {
        super(isHuman);
    }
    
    validateRange(x, y, board) {
        // Rooks move horizontally or vertically
        if (this.row + 1 !== x && this.col + 1 !== y) {
            return false;
        }
        
        // Check if path is clear
        const rowDirection = Math.sign((x - 1) - this.row);
        const colDirection = Math.sign((y - 1) - this.col);
        
        let currentRow = this.row;
        let currentCol = this.col;
        
        while (true) {
            currentRow += rowDirection;
            currentCol += colDirection;
            
            // If we reached the target position
            if (currentRow === x - 1 && currentCol === y - 1) {
                const targetPiece = board.getPiece(x, y);
                // Can move to empty square or capture opponent's piece
                return targetPiece === null || targetPiece.isHuman !== this.isHuman;
            }
            
            // Check if path is blocked
            if (board.getPiece(currentRow + 1, currentCol + 1) !== null) {
                return false;
            }
        }
    }
    
    getSymbol() {
        return this.isHuman ? '♖' : '♜';
    }
}

class Knight extends ChessPiece {
    constructor(isHuman) {
        super(isHuman);
    }
    
    validateRange(x, y, board) {
        const rowDiff = Math.abs((x - 1) - this.row);
        const colDiff = Math.abs((y - 1) - this.col);
        
        // Knights move in an L shape: 2 squares in one direction, 1 square perpendicular
        if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
            return false;
        }
        
        const targetPiece = board.getPiece(x, y);
        return targetPiece === null || targetPiece.isHuman !== this.isHuman;
    }
    
    getSymbol() {
        return this.isHuman ? '♘' : '♞';
    }
}

class Bishop extends ChessPiece {
    constructor(isHuman) {
        super(isHuman);
    }
    
    validateRange(x, y, board) {
        const rowDiff = Math.abs((x - 1) - this.row);
        const colDiff = Math.abs((y - 1) - this.col);
        
        // Bishops move diagonally
        if (rowDiff !== colDiff) {
            return false;
        }
        
        // Check if path is clear
        const rowDirection = Math.sign((x - 1) - this.row);
        const colDirection = Math.sign((y - 1) - this.col);
        
        let currentRow = this.row;
        let currentCol = this.col;
        
        while (true) {
            currentRow += rowDirection;
            currentCol += colDirection;
            
            // If we reached the target position
            if (currentRow === x - 1 && currentCol === y - 1) {
                const targetPiece = board.getPiece(x, y);
                // Can move to empty square or capture opponent's piece
                return targetPiece === null || targetPiece.isHuman !== this.isHuman;
            }
            
            // Check if path is blocked
            if (board.getPiece(currentRow + 1, currentCol + 1) !== null) {
                return false;
            }
        }
    }
    
    getSymbol() {
        return this.isHuman ? '♗' : '♝';
    }
}

class Queen extends ChessPiece {
    constructor(isHuman) {
        super(isHuman);
    }
    
    validateRange(x, y, board) {
        const rowDiff = Math.abs((x - 1) - this.row);
        const colDiff = Math.abs((y - 1) - this.col);
        
        // Queens can move like a rook or bishop
        const isDiagonal = rowDiff === colDiff;
        const isStraight = this.row + 1 === x || this.col + 1 === y;
        
        if (!isDiagonal && !isStraight) {
            return false;
        }
        
        // Check if path is clear
        const rowDirection = Math.sign((x - 1) - this.row);
        const colDirection = Math.sign((y - 1) - this.col);
        
        let currentRow = this.row;
        let currentCol = this.col;
        
        while (true) {
            currentRow += rowDirection;
            currentCol += colDirection;
            
            // If we reached the target position
            if (currentRow === x - 1 && currentCol === y - 1) {
                const targetPiece = board.getPiece(x, y);
                // Can move to empty square or capture opponent's piece
                return targetPiece === null || targetPiece.isHuman !== this.isHuman;
            }
            
            // Check if path is blocked
            if (board.getPiece(currentRow + 1, currentCol + 1) !== null) {
                return false;
            }
        }
    }
    
    getSymbol() {
        return this.isHuman ? '♕' : '♛';
    }
}

class King extends ChessPiece {
    constructor(isHuman) {
        super(isHuman);
    }
    
    validateRange(x, y, board) {
        const rowDiff = Math.abs((x - 1) - this.row);
        const colDiff = Math.abs((y - 1) - this.col);
        
        // Kings move one square in any direction
        if (rowDiff > 1 || colDiff > 1) {
            return false;
        }
        
        const targetPiece = board.getPiece(x, y);
        return targetPiece === null || targetPiece.isHuman !== this.isHuman;
    }
    
    getSymbol() {
        return this.isHuman ? '♔' : '♚';
    }
}