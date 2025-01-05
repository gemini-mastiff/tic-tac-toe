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

    return { getBoard, validateCell, placeToken};
}

function Cell() {
    let value = 0;

    const changeValue = (player) => value = player;

    const getValue = () => value;

    return { getValue, changeValue };
}

function domManipulation() {
    const commentary = document.querySelector("#commentary");
    const domBoard = document.querySelector("#board");
    const playerNames = document.querySelectorAll("[data-editable]")

    const generateDomCell = (cell, index) => {
        const domCell = document.createElement("div");
        domCell.classList.add("cell");
        domCell.setAttribute("data-index", index);
        if (cell) {
        const img = document.createElement("img");
        const src = cell === 1 ? "svg/close.svg" : "svg/circle-outline.svg";
        img.setAttribute("src", src);
        domCell.appendChild(img)
    }
        domBoard.appendChild(domCell);
    }

    const eraseDomBoard = () => {
        const allDomCells = document.querySelectorAll(".cell");
        allDomCells.forEach(domCell => {
            domCell.remove();
        });
    }

    const updateDomBoard = (board) => {
        const boardWithCellValues = board.getBoard().map(cell => cell.getValue());
        eraseDomBoard();
        boardWithCellValues.forEach(generateDomCell);

        const allDomCells = document.querySelectorAll(".cell");
        allDomCells.forEach((domCell) => {
            const index = domCell.dataset.index;
            domCell.addEventListener("click", () => {
                game.playRound(index);
            });
        }); 
    }

    const updateText = (text) => {
        commentary.textContent = text;
    }

    const changeNames = (e) => {
        const playerIndex = e.target.dataset.player;
        const prevLabel = e.target;
        const input = document.createElement("input");
        input.setAttribute("value", prevLabel.textContent);
        prevLabel.replaceWith(input);
        input.select();
      
        const save = function() {
            const newName = input.value === "" ? prevLabel.textContent : input.value;
            const newLabel = document.createElement(prevLabel.tagName.toLowerCase());
            newLabel.setAttribute("data-player", playerIndex)
            game.changePlayerName(playerIndex, newName); 
            newLabel.onclick = changeNames;
            newLabel.textContent = game.getPlayerName(playerIndex);
            input.replaceWith(newLabel);
        };
      
        input.addEventListener('blur', save, {
            once: true,
        });

        input.focus();
    }

    playerNames.forEach((playerName) => {
        playerName.addEventListener("click",changeNames);
    });

    return { updateDomBoard, updateText};

}

function gameController(playerOneName, playerTwoName) {
    const board = Gameboard();
    const dom = domManipulation();

    const players = [
        {
            name : playerOneName,
            token : 1,
        },
        {
            name : playerTwoName,
            token : 2,
        }
    ];

    // randomly selects the first player
    let activePlayer = players[Math.floor(Math.random()*2)];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const changePlayerName = (index, newName) => {
        players[index].name = newName;
        if (players[index] === getActivePlayer()){
            dom.updateText(`${getActivePlayer().name}'s turn`);
        }
    }

    const getPlayerName = (index) => players[index].name;

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        dom.updateDomBoard(board);
        dom.updateText(`${getActivePlayer().name}'s turn`);
    }

    const gameOver = (result) => {
        dom.updateDomBoard(board);
        let gameOverText = `Game Over!\r\n`
        if (result === "tie") {
            gameOverText +=`It's a tie!`
        } else {
            gameOverText += `${result} wins!`
        }
        dom.updateText(gameOverText);
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
         if (rowWinOne.every(token)
            || rowWinTwo.every(token)
            || rowWinThr.every(token)
            || colWinOne.every(token)
            || colWinTwo.every(token)
            || colWinThr.every(token)
            || diaWinOne.every(token)
            || diaWinTwo.every(token)) {
            return player.name;
        } else if (!boardWithCellValues.includes(0)){
            return "tie";
        } else {
            return;
        }
    }

    const playRound = (index) => {
        // This validation step ensures that if a player selects an occupied
        // cell, they can take another turn and select a different cell
        const validation = board.validateCell(index);
        if (validation === true) {
            board.placeToken(index, getActivePlayer().token);
            const winner = checkWinner(getActivePlayer());
            if (winner){
                gameOver(winner);
                return;
            }
            // The players switch only when a token has been dropped
            switchPlayer();
        } else {
            dom.updateText(`Invalid! This space is already taken!\r\n${getActivePlayer().name}'s turn`);
            return;
        }
        printNewRound();
    }

    return { getPlayerName, playRound, changePlayerName, printNewRound }
}

// let game = gameController()

const startBtn = document.querySelector("#startBtn")
startBtn.addEventListener("click", () => {
    const playerOneName = document.querySelector(`[data-player="0"]`).textContent;
    const playerTwoName = document.querySelector(`[data-player="1"]`).textContent;
    game = gameController(playerOneName, playerTwoName);
    game.printNewRound();
    startBtn.textContent = "Restart!";
});