function createGameboard() {
    const board = []

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(newCell());
        }
    }
    
    const getBoard = () => board;
    
    const validateCell = (row, column) => {
        const cell = board[row][column];
        if(cell.getValue() != 0){
            return false;
        }
        else {
            return true;
        }
    }

    const placeToken = (row, column, token) => {
        const cell = board[row][column];
        cell.changeValue(token);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row => row.map((cell => cell.getValue()))));
        console.log(boardWithCellValues);
    }

    return { getBoard, validateCell, placeToken, printBoard};
}

function newCell() {
    let value = 0

    const changeValue = (player) => value = player;

    const getValue = () => value;

    return { getValue, changeValue }
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
    ];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
        board.printBoard();
    }

    const playRound = (row, column) => {
        // This validation step ensures that if a player selects an occupied
        // cell, they can take another turn and select a different cell
        const validation = board.validateCell(row, column);
        if (validation === true) {
            console.log(`Placing a ${getActivePlayer().token} at row ${row}, column ${column}...`);
            board.placeToken(row, column, getActivePlayer().token);
            // The players switch only when a token has been dropped
            switchPlayer();
        } else {
            console.log(`Invalid! ${row}, ${column} is already taken!`)
        }
        printNewRound();
    }

    printNewRound();

    return { getActivePlayer, playRound }

}

const game = gameController()

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