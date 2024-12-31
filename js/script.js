function createGameboard() {
    const board = []

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(newCell());
        }
    }
    
    const getBoard = () => board;

    const placeToken = (row, column, token) => {
        const cell = board[row][column];
        if(cell.getValue() != 0){
            console.log(`Invalid! ${row}, ${column} is already taken!`)
            return
        }
        else {
            cell.changeValue(token);
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row => row.map((cell => cell.getValue()))));
        console.log(boardWithCellValues);
    }

    return { getBoard, placeToken, printBoard };
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

    const printNewRound = () => {
        console.log(`${activePlayer.name}'s turn:`);
        board.printBoard();
    }

    const playRound = (row, column) => {
        console.log(`Placing a ${activePlayer.token} at row ${row}, column ${column}...`);
        board.placeToken(row, column, activePlayer.token);
        switchPlayer();
        printNewRound();
    }

    printNewRound();

    return { printNewRound, switchPlayer, playRound }

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