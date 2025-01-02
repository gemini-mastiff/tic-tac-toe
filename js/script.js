function Gameboard() {
    const board = [];

    for (let i = 0; i < 9; i++) {
        board.push(Cell());
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
        let counter = 0;
        boardWithCellValues.forEach((i) => {
            boardString += i;
            counter++;
            if (counter === 3){
                boardString += `\n`;
                counter = 0;
            }
        });
        console.log(boardString);
    }

    return { getBoard, validateCell, placeToken, printBoard};
}

function Cell() {
    let value = 0;

    const changeValue = (player) => value = player;

    const getValue = () => value;

    return { getValue, changeValue }
}

function gameController() {
    const board = Gameboard();

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
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn:`);
    }

    const gameOver = (result) => {
        board.printBoard();
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
            switchPlayer();
        } else {
            console.log(`Invalid! Position ${number} is already taken!`);
        }
        printNewRound();
    }

    printNewRound();

    return { getActivePlayer, playRound }
}

function domManipulation() {
    const commentary = document.querySelector("#commentary");
    const domBoard = document.querySelector("#board");
    const board = Gameboard()

    const generateDiv = (cell) => {
        const div = document.createElement("div");
        if (cell.getValue() === 1) {
            const cross = document.createElement("img");
            cross.setAttribute("src", "svg/close.svg");
            div.appendChild(cross);
        } else if (cell.getValue() === 2) {
            const nought = document.createElement("img");
            nought.setAttribute("src", "svg/circle-outline.svg");
            div.appendChild(nought);
        }
        domBoard.appendChild(div);
    }

    const updateDomBoard = () => {
        const arr = board.getBoard().slice().reverse();
        arr.forEach(generateDiv(cell));
    }

    return { updateDomBoard }

}

const game = gameController()