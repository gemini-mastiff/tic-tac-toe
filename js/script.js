function Gameboard() {
    const board = []

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push("Empty");
        }
    }
    console.log(board)
}

Gameboard()