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

function domManipulation() {
    const commentary = document.querySelector("#commentary");
    const victory = document.querySelector("#victory")
    const domBoard = document.querySelector("#board");
    const playerNames = document.querySelectorAll("[data-editable]")
    
    const board = Gameboard();

    const generateDomCell = (cell, index) => {
        const domCell = document.createElement("div");
        domCell.classList.add("cell")
        domCell.setAttribute("data-index", index);
        if (cell === 1) {
            const cross = document.createElement("img");
            cross.setAttribute("src", "svg/close.svg");
            domCell.appendChild(cross);
        } else if (cell === 2) {
            const nought = document.createElement("img");
            nought.setAttribute("src", "svg/circle-outline.svg");
            domCell.appendChild(nought);
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
                game.playRound(index)
               });
           }); 
    }

    const updateText = (text, v = false) => {
        // victory will only update when called the optional argument is passed
        !v ? commentary.textContent = text : victory.textContent = text;
    }

    const changeNames = (e) => {
        const playerIndex = e.target.dataset.player;
        const prevLabel = e.target;
        const input = document.createElement("input");
        input.setAttribute("value", prevLabel.textContent);
        prevLabel.replaceWith(input);
      
        const save = function() {
          const newLabel = document.createElement(prevLabel.tagName.toLowerCase());
          newLabel.setAttribute("data-player", playerIndex)
          game.changePlayerName(playerIndex, input.value); 
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
        playerIndex = playerName.dataset.player;
        playerName.addEventListener("click",changeNames);
    })

    return { updateDomBoard, updateText}

}

function gameController() {
    const board = Gameboard();
    const dom = domManipulation();

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

    // randomly selects the first player
    let activePlayer = players[Math.floor(Math.random()*2)];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const changePlayerName = (index, newName) => {
        console.log(getPlayerName(index))
        players[index].name = newName;
        if (players[index] === getActivePlayer()){
            dom.updateText(`${getActivePlayer().name}'s turn`);
        }
        console.log(getPlayerName(index))
    }

    const getPlayerName = (index) => players[index].name;

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        dom.updateDomBoard(board);
        dom.updateText(`${getActivePlayer().name}'s turn`);
    }

    const gameOver = (result) => {
        board.printBoard();
        dom.updateDomBoard(board);
        dom.updateText(`Game Over!`, true);
        if (result === "tie") {
            dom.updateText(`It's a tie!`);
        } else {
            dom.updateText(`${result} wins!`);
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

    const playRound = (index) => {
        // This validation step ensures that if a player selects an occupied
        // cell, they can take another turn and select a different cell
        const validation = board.validateCell(index);
        if (validation === true) {
            dom.updateText(``, true)
            board.placeToken(index, getActivePlayer().token);
            const winner = checkWinner(getActivePlayer());
            if (winner){
                gameOver(winner);
                return;
            }
            // The players switch only when a token has been dropped
            switchPlayer();
        } else {
            dom.updateText(`Invalid! This space is already taken!`, true);
        }
        printNewRound();
    }

    printNewRound();

    return { getPlayerName, playRound, changePlayerName }
}

const game = gameController()