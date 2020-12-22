/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Cell {
    constructor({ number = 0, mine = false } = {}) {
        this._flagged = false;
        this._mine = false;
        this._isOpen = false;

        if (number < 0 || number > 8)
            throw new Error(`Out Of Range: Number (${number}) should be in the 1 - 8 for Cell Object`)

        if (!mine)
            this._number = number;
        else
            this._mine = true;
    }

    get number() {
        return this._number;
    }

    get isMined() {
        return this._mine;
    }

    get isFlagged() {
        return this._flagged;
    }

    get isOpen() {
        return this._isOpen;
    }

    toggleFlag() {
        this._flagged = !this._flagged;
    }

    open() {
        this._isOpen = true;
    }

    toString() {
        return `[Cell ${this._mine ? 'mined' : this._number}${this._flagged ? ' Flagged' : ''}]`;
    }
}

function throwDimensionError(d, value) {
    throw new Error(`Out of Range: ${d}(${value}) should be above 0`);
}

function getValuesAround(ary = [[]], x = 0, y = 0) {
    let retVal = [];

    const isValidIndex = ({ x = 0, y = 0 }) => x >= 0 && y >= 0 && x < ary.length && y < ary[0].length;

    if (isValidIndex({ x: x - 1 }))
        retVal.push(ary[x - 1][y]);
    if (isValidIndex({ y: y - 1 }))
        retVal.push(ary[x][y - 1]);
    if (isValidIndex({ x: x - 1, y: y - 1 }))
        retVal.push(ary[x - 1][y - 1]);
    if (isValidIndex({ x: x + 1, y: y + 1 }))
        retVal.push(ary[x + 1][y + 1]);
    if (isValidIndex({ x: x + 1 }))
        retVal.push(ary[x + 1][y]);
    if (isValidIndex({ y: y + 1 }))
        retVal.push(ary[x][y + 1]);
    if (isValidIndex({ x: x + 1, y: y - 1 }))
        retVal.push(ary[x + 1][y - 1]);
    if (isValidIndex({ x: x - 1, y: y + 1 }))
        retVal.push(ary[x - 1][y + 1]);

    return retVal;
}

export const MAX_SEED_RANGE = 10000000;
export const DEFAULT_MINE_COUNT = 10;
export const DEFAULT_HEIGHT = 10;
export const DEFAULT_WIDTH = 10;

export class Minesweeper {
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, mineCount = DEFAULT_MINE_COUNT) {
        this._flagCount = 0;
        this._mineCount = mineCount;
        this._width = width;
        this._height = height;

        this._startTime = Date.now();
        this._isRunning = true;
        this._timeTake = 0;

        this._gameActive = true;
        this._won = false;

        if (width < 1)
            throwDimensionError('width', width);

        if (height < 1)
            throwDimensionError('height', height);

        if (mineCount >= width * height)
            throw new Error("Mine count should be greater than the cell count!");

        this._array = new Array(width).fill(null).map(() => new Array(height).fill(new Cell()));

        for (let i = 0; i < mineCount; i++) {
            let randWidth = getRandomInt(0, width - 1);
            let randHeight = getRandomInt(0, height - 1);

            if (this._array[randWidth][randHeight].isMined)
                i--;
            else
                this._array[randWidth][randHeight] = new Cell({ mine: true });
        }

        for (let x = 0; x < this._array.length; x++)
            for (let y = 0; y < this._array[0].length; y++) {
                let vals = getValuesAround(this._array, x, y);

                let mines = 0;
                vals.forEach(cell => {
                    if (cell.isMined)
                        mines++;
                });

                if (!this._array[x][y].isMined) {
                    this._array[x][y] = new Cell({ number: mines });
                }
            }
    }

    get seed() {
        return this._seed;
    }

    get grid() {
        return this._array.flat();
    }

    get isActive() {
        return this._gameActive;
    }

    get isWin() {
        return this._won;
    }

    get mineCount() {
        return this._mineCount;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get flagCount() {
        return this._flagCount;
    }

    get time() {
        return this._timeTake + (this._isRunning ? Date.now() - this._startTime : 0);
    }

    get isTimerRunning() {
        return this._isRunning;
    }

    _stopTimer() {
        this._isRunning = false;
        this._timeTake += Date.now() - this._startTime;
    }

    _startTimer() {
        this._isRunning = true;
        this._startTime = Date.now();
    }

    toggleTimer() {
        if (this._isRunning && this._gameActive)
            this._stopTimer();
        else if (this._gameActive)
            this._startTimer();
    }

    toggleFlag(x, y) {
        if (!this._array[x][y].isFlagged && this._flagCount < this._mineCount) {
            this._array[x][y].toggleFlag();
            this._flagCount++;

            if (this._flagCount === this._mineCount && this.allFlagged()) {
                this._won = true;
                this._gameActive = false;
                this._stopTimer();
                return false;
            }

            return true;
        } else if (this._array[x][y].isFlagged) {
            this._array[x][y].toggleFlag();
            this._flagCount--;
            return true;
        }
        return false;
    }

    allFlagged() {
        if (this._flagCount === this._mineCount) {
            for (let x = 0; x < this._array.length; x++)
                for (let y = 0; y < this._array[0].length; y++)
                    if (this._array[x][y].isFlagged && !this._array[x][y].isMined)
                        return false;

            return true;
        }
        return false;
    }

    open(x, y) {
        if (this._gameActive) {
            let cell = this._array[x][y];

            if (cell.isOpen || cell.isFlagged)
                return false;

            if (cell.isMined) {
                cell.open();
                this._gameActive = false;
                this._stopTimer();
                return false;
            }

            cell.open();

            if (cell.number === 0) {
                const isValidIndex = ({ xC = x, yC = y }) => xC >= 0 && yC >= 0 && xC < this._array.length && yC < this._array[0].length;

                if (isValidIndex({ xC: x - 1 }))
                    this.open(x - 1, y);
                if (isValidIndex({ yC: y - 1 }))
                    this.open(x, y - 1);
                if (isValidIndex({ xC: x - 1, yC: y - 1 }))
                    this.open(x - 1, y - 1);
                if (isValidIndex({ xC: x + 1, yC: y + 1 }))
                    this.open(x + 1, y + 1);
                if (isValidIndex({ xC: x + 1 }))
                    this.open(x + 1, y);
                if (isValidIndex({ yC: y + 1 }))
                    this.open(x, y + 1);
                if (isValidIndex({ xC: x + 1, yC: y - 1 }))
                    this.open(x + 1, y - 1);
                if (isValidIndex({ xC: x - 1, yC: y + 1 }))
                    this.open(x - 1, y + 1);
            }

            return true;
        }

        return false;
    }
}