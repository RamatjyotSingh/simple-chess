# Simple Chess Game

A browser-based chess game where you can play against an AI opponent with adjustable difficulty.

## Features

- Complete chess game implementation with standard rules
- Responsive board that works on both desktop and mobile devices
- Two AI difficulty levels:
  - Easy: Makes random valid moves
  - Hard: Prioritizes capturing valuable pieces and king
- Visual highlighting of selected pieces and valid moves
- Move history with standard chess notation
- Pawn promotion to queen
- Game status indicators

## How to Play

1. Open index.html in any modern web browser
2. You play as white (bottom pieces)
3. Click on a piece to select it and see valid moves
4. Click on a highlighted square to move the selected piece
5. The AI will automatically make its move after yours
6. Continue until checkmate is achieved

## Controls

- **New Game**: Reset the board and start a fresh game
- **AI Difficulty**: Choose between Easy and Hard AI opponents

## Project Structure

```
simple-chess/
├── css/
│   └── style.css     # Game styling
├── js/
│   ├── board.js      # Board logic and UI interaction
│   ├── game.js       # Game state management
│   └── pieces.js     # Chess piece classes and movement rules
└── index.html        # Main HTML file
```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Unicode chess symbols for pieces

## Future Improvements

- Add castling moves
- Add en passant captures
- Implement check and checkmate detection
- Add a timed mode
- Sound effects
- Support for player vs player mode
- Save/load game functionality

## Installation

No installation required! Simply clone the repository and open index.html in your web browser:

```bash
git clone https://github.com/yourusername/simple-chess.git
cd simple-chess
open index.html  # or double-click the file in your file explorer
```
