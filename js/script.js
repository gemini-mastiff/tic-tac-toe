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

    const gameOver = (result) => {
        console.log("Game Over!");
        if (result === "tie") {
            console.log("It's a tie!");
        } else {
            console.log(`${result} wins!`);
        }
    }
    
    const checkWinner = (player) => {
        const boardWithCellValues = board.getBoard().map(cell => cell.getValue());
        const token = (val) => val === player.token;
        const rowWinOne = [0, 1, 2].map(x => boardWithCellValues[x]);
        const rowWinTwo = [3, 4, 5].map(x => boardWithCellValues[x]);
        const rowWinThr = [6, 7, 8].map(x => boardWithCellValues[x]);
        const colWinOne = [0, 3, 6].map(x => boardWithCellValues[x]);
        const colWinTwo = [1, 4, 7].map(x => boardWithCellValues[x]);
        const colWinThr = [2, 5, 8].map(x => boardWithCellValues[x]);
        const diaWinOne = [0, 4, 8].map(x => boardWithCellValues[x]);
        const diaWinTwo = [2, 4, 6].map(x => boardWithCellValues[x]);
        if (!boardWithCellValues.includes(0)){
            return "tie";
        } else if (rowWinOne.every(token)
            || rowWinTwo.every(token)
            || rowWinThr.every(token)
            || colWinOne.every(token)
            || colWinTwo.every(token)
            || colWinThr.every(token)
            || diaWinOne.every(token)
            || diaWinTwo.every(token)) {
            return player.name;
        } else {
            return;
        }
    }

    const playRound = (number) => {
        index = number-1
        // This validation step ensures that if a player selects an occupied
        // cell, they can take another turn and select a different cell
        const validation = board.validateCell(index);
        if (validation === true) {
            console.log(`Placing a ${getActivePlayer().token} at position ${number}...`);
            board.placeToken(index, getActivePlayer().token);
            const winner = checkWinner(getActivePlayer());
            if (winner){
                gameOver(winner);
                return;
            }
            // The players switch only when a token has been dropped
            // switchPlayer();
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