import Cell from './Cell';

// ===================
//  Handles Game Logic
// ===================
class Game {
  constructor(rows, cols, bombCount) {
    this.rowLength = rows;
    this.colLength = cols;
    this.bombCount = bombCount;
    this.flagCount = 0;
    this.isOver = false;
    this.board = this._get2DGrid(this.rowLength, this.colLength);

    this._seedBomb();
  }

  reset() {
    this.board = this._get2DGrid(this.rowLength, this.colLength);
    this.flagCount = 0;
    this.isOver = false;

    this._seedBomb();
  }

  addFlag(cell) {
    cell.hasFlag = true;
    this.flagCount++;
  }

  removeFlag(cell) {
    cell.hasFlag = false;
    this.flagCount--;
  }

  // reveal a cell, and open neighboring cells recursively if cell is empty
  reveal(cell) {
    cell.isOpen = true;
    if (cell.value === '*') {
      this.isOver = true;
      return;
    }
    if (cell.value) return;

    cell.neighbors.forEach(neighbor => {
      if (!neighbor.isOpen && neighbor.value !== '*' && !neighbor.hasFlag) {
        this.reveal(neighbor);
      }
    });
  }

  // helper method to create 2D array for board
  _get2DGrid(rows, cols) {
    let grid = (new Array(rows));

    for (let row = 0; row < grid.length; row++) {
      grid[row] = new Array(cols).fill(null);
    }

    return grid;
  }

  // helper method to seed bombs randomly and add numeric hints on board
  _seedBomb() {
    let bombCounter = this.bombCount;

    // seed bomb randomly
    while (bombCounter > 0) {
      let randomRow = Math.floor(Math.random() * this.rowLength);
      let randomCol = Math.floor(Math.random() * this.colLength);

      if (!this.board[randomRow][randomCol]) {
        this.board[randomRow][randomCol] = new Cell('*');
        bombCounter--;
      }
    }

    // initialize empty spaces with Cell objects first
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (!this.board[row][col]) {
          this.board[row][col] = new Cell();
        }
      }
    }

    this._populateHints();
  }

  // populate numeric hints on board
  _populateHints() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        this._getNeighbors(this.board[row][col], row, col);
      }
    }
  }

  // count bombs from neighbors, and push all neighboring cell objects into
  // current cell for future reference
  _getNeighbors(cell, rowPos, colPos) {
    // position difference of neighbors relative to current cell position
    let deltaPosition = [
    //[row, col]
      [-1, -1], // top left
      [-1, 0],  // top
      [-1, 1],  // top right
      [0, -1],  // left
      [0, 1],   // right
      [1, -1],  // bottom left
      [1, 0],   // bottom
      [1, 1]    // bottom right
    ];

    let bombCount = 0;

    deltaPosition.forEach(coord => {
      let nRowPos = rowPos + coord[0];
      let nColPos = colPos + coord[1];

      if (nRowPos > -1 && nRowPos < this.rowLength) {
        let neighbor = this.board[nRowPos][nColPos];
        if (neighbor) {
          cell.neighbors.push(neighbor); // populate cell neighbors list

          if (neighbor.value === '*') bombCount++; // while at it, count bombs for hint
        }
      }
    });

    if (cell.value !== '*') cell.value = bombCount;
  }

  // convenient method to print out board values in console, not used in actual app
  print() {
    this.board.forEach(row => {
      let str = '';
      row.forEach(col => {
        let state = col.isOpen ? 'o' : 'c';
        if (col && col.value) {
          str += `${col.value}${state}, `;
        } else {
          str += ` ${state}, `;
        }
      });
      console.log(str);
    })
  }
}

export default Game;
