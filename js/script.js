function createGameboard() {
    const board = []

    for (let i = 0; i < 9; i++) {
        board.push(newCell());
    }

    const getBoard = () => board;
    
    const validateCell = (index) => {
        const cell = board[index];
        if(cell.getValue() != 0){
            return false;
        }
        else {
            return true;
        }
    }

    const placeToken = (index, token) => {
        const cell = board[index];
        cell.changeValue(token);
    }
    
    const printBoard = () => {
        const boardWithCellValues = board.map(cell => cell.getValue());
        let boardString = '';
        let counter = 0
        boardWithCellValues.forEach((i) => {
            boardString += i;
            counter++
            if (counter === 3){
                boardString += `\n`;
                counter = 0;
            }
        });
        console.log(boardString);
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

    const playRound = (number) => {
        index = number-1
        // This validation step ensures that if a player selects an occupied
        // cell, they can take another turn and select a different cell
        const validation = board.validateCell(index);
        if (validation === true) {
            console.log(`Placing a ${getActivePlayer().token} at position ${number}...`);
            board.placeToken(index, getActivePlayer().token);
            // The players switch only when a token has been dropped
            switchPlayer();
        } else {
            console.log(`Invalid! Position ${number} is already taken!`)
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



// FULL BOARD:
// boardWithCellValues.forEach(row => {
//     if (row.includes(0)){
//         continue;
//     } else {
//         game.gameOver(); 
//     }
// })

// 

// DIAGONALS:
// if (board[0][0].getValue() === player.token
//     && board[1][1].getValue() === player.token
//     && board[2][2].getValue() === player.token
//     || board[0][2].getValue() === player.token
//     && board[1][1].getValue() === player.token
//     && board[2][0].getValue() === player.token){
//          return WIN YAYYYY
// }
