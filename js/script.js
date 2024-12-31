function createGameboard() {
    const board = []

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(newCell());
        }
    }
    
    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map((row => row.map((cell => cell.getValue()))));
        console.log(boardWithCellValues);
    }

    return { getBoard, printBoard };
}

function newCell() {
    let value = 0

    const getValue = () => value;

    return { getValue }
}

function gameController() {
    const board = createGameboard();

    const players = [
        {
            name : "Player 1",
            token : 1,
        },
        {
            name : "Player 2",
            token : 2,
        }
    ] 
}


// LOOP:
// new board is created, 0 in all cells
// PLAYER 1 TURN:
// print empty board
// Player 1 selects cell
// Cell value changed to 1
// PLAYER 2 TURN:
// print board 
// Player 2 selects cell
// controller validates if the cell has been taken already
// if it has, prompt again
// if not, Cell value to 2
// REPEAT
// Check for success states (3 in a row, any direction)
// check for winner, declare winner
// end game