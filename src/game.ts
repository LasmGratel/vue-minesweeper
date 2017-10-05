export enum CellType {
  NORMAL, BOMB, FLAG, FLAGBOMB
}

export class Cell {
  public x: number;
  public y: number;
  public type: CellType = CellType.NORMAL;
  private neighbours: Cell[] = [];
  public activeNeighbours: number = 0;
  private revealed: boolean = false;

  constructor(x: number, y: number, isBomb: boolean) {
    if (isBomb)
      this.type = CellType.BOMB;
    this.x = x;
    this.y = y;
  }

  public isRevealed(): boolean {
    return this.revealed || this.type === CellType.BOMB;
  }

  public addNeighbour(cell: Cell): void {
    this.neighbours.push(cell);
    if (cell.type === CellType.BOMB)
      ++this.activeNeighbours;
  }

  public mark() {
    switch (this.type) {
      case CellType.NORMAL:
        this.type = CellType.FLAG;
        break;
      case CellType.FLAG:
        this.type = CellType.NORMAL;
        break;
      case CellType.BOMB:
        this.type = CellType.FLAGBOMB;
        break;
      case CellType.FLAGBOMB:
        this.type = CellType.BOMB;
    }
  }

  public reveal(fn: Function, context) {
    this.revealed = true;
    if (this.type === CellType.BOMB) {
      return;
    }
    if (this.activeNeighbours === 0) {
      this.neighbours.forEach(neighbour => {
        if (!neighbour.isRevealed()) {
          neighbour.reveal(fn, context);
        }
      });
    }
    fn.call(context);
  };
}

export class Board {
  height: number;
  width: number;
  board: Cell[] = [];
  bombStack: {};

  public reset(rows: number, colls: number, numBombs: number) {
    let x, y, row, self = this;

    this.width = colls;
    this.height = rows;

    this.board = []; // reset the board
    this.bombStack = {}; // reset our current bomb stack

    this.generateBombs(numBombs);

    // build the data structure
    for (y = 0; y < this.height; y++) {
      row = [];
      this.board.push(row);
      for (x = 0; x < this.width; x++) {
        const isBomb = this.bombStack[y] && this.bombStack[y][x];
        row.push(new Cell(x, y, isBomb));
      }
    }

    // assign neightbour reference for each cell
    this.traversCells(function (cell: Cell) {
      const neighbours = self.calcNeighbours(cell);
      neighbours.forEach(neighbour => cell.addNeighbour(neighbour));
    });

    return this;
  }

  // run a callback on each cell in the board
  traversCells(fn) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        fn(this.getCell(x, y));
      }
    }
  }
  public validate(): boolean {
    let numActive = 0;
    this.traversCells(function (cell: Cell) {
      if (!cell.isRevealed())
        numActive += 1;
    });
    return numActive == 0;
  }

  public reveal(cell: Cell): boolean {
    cell.reveal(this.validate, this);
    return cell.type === CellType.BOMB;
  }


  public getCell (x, y) {
    return this.board[y][x];
  }

  generateBombs (numBombs) {
    for (let i = 0; i < numBombs; i++) {
      this.generateBomb();
    }
  }

  generateBomb() {
    const x = Math.floor(Math.random() * this.width);
    const y = Math.floor(Math.random() * this.height);
    if (this.bombStack[y] && this.bombStack[y][x]) { // do not allow duplicates
      return this.generateBomb();
    }
    this.bombStack[y] = this.bombStack[y] || {};
    this.bombStack[y][x] = true;
  }

  calcNeighbours(cell: Cell) {
    let i, j, data = [], x = cell.x, y = cell.y;
    for (i = y - 1; i <= y + 1; i++) {
      if (i < 0 || i >= this.height) continue;
      for (j = x - 1; j <= x + 1; j++) {
        if (j < 0 || j >= this.width) continue;
        if (x === j && y === i) continue;
        data.push(this.getCell(j, i));
      }
    }
    return data;
  }
}
