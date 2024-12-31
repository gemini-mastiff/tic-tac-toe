function createGameboard() {
    const board = []

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(newCell());
        }
    }
    
    const getBoard = () => board;

    return { getBoard };
}

function newCell() {
    let value = 0

    const getValue = () => value;

    return { getValue }
}

function gameController() {
    const board = createGameboard();

    const player = {
        name : "Player 1",
        token : 1,
    }
}