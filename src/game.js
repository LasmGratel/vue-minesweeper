"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CellType;
(function (CellType) {
    CellType[CellType["NORMAL"] = 0] = "NORMAL";
    CellType[CellType["BOMB"] = 1] = "BOMB";
    CellType[CellType["FLAG"] = 2] = "FLAG";
    CellType[CellType["FLAGBOMB"] = 3] = "FLAGBOMB";
})(CellType = exports.CellType || (exports.CellType = {}));
var Cell = /** @class */ (function () {
    function Cell(x, y, isBomb) {
        this.type = CellType.NORMAL;
        this.neighbours = [];
        this.activeNeighbours = 0;
        this.revealed = false;
        if (isBomb)
            this.type = CellType.BOMB;
        this.x = x;
        this.y = y;
    }
    Cell.prototype.isRevealed = function () {
        return this.revealed || this.type === CellType.BOMB;
    };
    Cell.prototype.addNeighbour = function (cell) {
        this.neighbours.push(cell);
        if (cell.type === CellType.BOMB)
            ++this.activeNeighbours;
    };
    Cell.prototype.mark = function () {
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
    };
    Cell.prototype.reveal = function (fn, context) {
        this.revealed = true;
        if (this.type === CellType.BOMB) {
            return;
        }
        if (this.activeNeighbours === 0) {
            this.neighbours.forEach(function (neighbour) {
                if (!neighbour.isRevealed()) {
                    neighbour.reveal(fn, context);
                }
            });
        }
        fn.call(context);
    };
    ;
    return Cell;
}());
exports.Cell = Cell;
var Board = /** @class */ (function () {
    function Board() {
        this.board = [];
    }
    Board.prototype.reset = function (rows, colls, numBombs) {
        var x, y, row, self = this;
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
                var isBomb = this.bombStack[y] && this.bombStack[y][x];
                row.push(new Cell(x, y, isBomb));
            }
        }
        // assign neightbour reference for each cell
        this.traversCells(function (cell) {
            var neighbours = self.calcNeighbours(cell);
            neighbours.forEach(function (neighbour) { return cell.addNeighbour(neighbour); });
        });
        return this;
    };
    // run a callback on each cell in the board
    Board.prototype.traversCells = function (fn) {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                fn(this.getCell(x, y));
            }
        }
    };
    Board.prototype.validate = function () {
        var numActive = 0;
        this.traversCells(function (cell) {
            if (!cell.isRevealed())
                numActive += 1;
        });
        return numActive == 0;
    };
    Board.prototype.reveal = function (cell) {
        cell.reveal(this.validate, this);
        return cell.type === CellType.BOMB;
    };
    Board.prototype.getCell = function (x, y) {
        return this.board[y][x];
    };
    Board.prototype.generateBombs = function (numBombs) {
        for (var i = 0; i < numBombs; i++) {
            this.generateBomb();
        }
    };
    Board.prototype.generateBomb = function () {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        if (this.bombStack[y] && this.bombStack[y][x]) {
            return this.generateBomb();
        }
        this.bombStack[y] = this.bombStack[y] || {};
        this.bombStack[y][x] = true;
    };
    Board.prototype.calcNeighbours = function (cell) {
        var i, j, data = [], x = cell.x, y = cell.y;
        for (i = y - 1; i <= y + 1; i++) {
            if (i < 0 || i >= this.height)
                continue;
            for (j = x - 1; j <= x + 1; j++) {
                if (j < 0 || j >= this.width)
                    continue;
                if (x === j && y === i)
                    continue;
                data.push(this.getCell(j, i));
            }
        }
        return data;
    };
    return Board;
}());
exports.Board = Board;
