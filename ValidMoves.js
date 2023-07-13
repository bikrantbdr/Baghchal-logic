// take board state, goat state, tiger state
const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
];
const directionsWithDiagonal = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
    { row: -1, col: -1 },  //top left
    { row: -1, col: 1 },  //top right
    { row: 1, col: -1 },  //bottom left
    { row: 1, col: 1 },  //bottom right
];
const Board = {
    //goat 1
    //tiger 0
    board: [
        [0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 1, 1, null],
        [1, 1, 1, 1, 1],
    ],

    tigers: {
        trapped: [[0, 0], [1, 0], [2, 0],], //no of trapped tigers
        position: [[0, 0], [1, 0], [2, 0], [3, 0]]
    },

    goats: {
        onHand: 0,  //initially 20 Goats are in hand to place
        killed: 0,   //initially 0 goats are killed
        spaceCaptured: [],
    },

    playerTurn: "goat", //initially its goat turn

    //Position of peice selected (find next valid move for this piece)
    //-1 means no selection needed (placing the goats on baord still left)
    selectedPosition: [3, 1],
    nextValidMoves: [],   //valid move for selected peice
}


//chek the position is even
checkEven = (position) => {
    // even
    if ((position[0] + position[1]) % 2 === 0) {
        // console.log("even")
        return true;
    }
    else return false;
}

//returns the tiger trapped in the board
trappedTigers = (Board) => {
    newTrapped = []
    for (let i = 0; i < 4; i++) {
        validMove = []
        position = Board.tigers.position[i]
        row = position[0]
        col = position[1]
        //if the selected position is even
        if (checkEven(row, col)) {
            //we need to check for diagonal too cause the pieces in even places have that choices
            directionChoice = directionsWithDiagonal
        }
        else {
            directionChoice = directions
        }
        for (const direction of directionChoice) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;

            //one more step in a straight line
            const newKillRow = newRow + direction.row;
            const newKillCol = newCol + direction.col;

            // console.log("new", newRow, newCol)
            // console.log("newkill", newKillRow, newKillCol)

            // Check if the new position is within the bounds of the board
            if (newRow >= 0 &&
                newRow < Board.board.length &&
                newCol >= 0 &&
                newCol < Board.board[row].length
            ) {
                // Check if the new position is empty
                if (Board.board[newRow][newCol] === null) {
                    validMove.push([newRow, newCol])
                    // console.log("push traped", newRow, newCol)
                }
                //if killing a goat is possible by going over the goat position in a straight line
                else if (Board.board[newRow][newCol] === 1) {
                    //check if it is in bound of board
                    if (newKillRow >= 0 &&
                        newKillRow < Board.board.length &&
                        newKillCol >= 0 &&
                        newKillCol < Board.board[row].length
                    ) {
                        if (Board.board[newKillRow][newKillCol] === null) {
                            validMove.push([newKillRow, newKillCol])
                            // console.log("push newkill", newKillRow, newKillCol)
                        }
                    }
                }
            }
        }
        if (validMove.length === 0) {
            newTrapped.push(Board.tigers.position[i])
        }
    }
    return (newTrapped)
}

//returns the space captured by goats
capturedSpace = (Board) => {
    newSpaceCaptured = []
    for (let row = 0; row < Board.board.length; row++) {
        for (let col = 0; col < Board.board[row].length; col++) {
            if (Board.board[row][col] === null) {
                if (checkEven(row, col)) {
                    //we need to check for diagonal too cause the pieces in even places have that choices
                    directionChoice = directionsWithDiagonal
                }
                else {
                    directionChoice = directions
                }

                for (const direction of directionChoice) {
                    const newRow = row + direction.row;
                    const newCol = col + direction.col;

                    //one more step in a straight line
                    const newKillRow = newRow + direction.row;
                    const newKillCol = newCol + direction.col;

                }
            }
        }
    }
}

checkGoatAction = (Board, row, column) => {
    newBoard = JSON.parse(JSON.stringify(Board))
    newBoard.board[row][column] = 1
    // console.log(Board.board,newBoard.board)
    newTrapped = trappedTigers(newBoard)
    // newSpaceCaptured =capturedSpace(newBoard)

    // console.log("prev trapped condition",Board.tigers.trapped)
    // console.log("new trapped condition",row,column,trappedTigers(newBoard))

    //trap or untrap tigers

    if (Board.tigers.trapped.length > newTrapped.length) {
        console.log("untrap")
        return ("untrap")
    }
    else if (Board.tigers.trapped.length < newTrapped.length) {
        console.log("trap", Board.tigers.trapped.length, newTrapped.length)
        return ("trap")
    }
    else return ("move")
}



validMove = (Board) => {
    //valid moves to be returened
    const nextValidMoves = [];

    // Check if it's the goat's turn and there are goats left to place on the board
    if (Board.playerTurn === "goat" && Board.goats.onHand > 0) {
        //Iterate over each cell of the board
        for (let row = 0; row < Board.board.length; row++) {
            for (let column = 0; column < Board.board[row].length; column++) {
                // Check if the cell is empty (null) and add it as a valid move
                if (Board.board[row][column] === null) {
                    // nextValidMoves.push([row, column,checkGoatAction(Board,row,column)])
                    nextValidMoves.push([row, column])
                }
            }
        }
    }
    //check valid moves when its turn for goat to move
    else if (Board.playerTurn === "goat" &&
        Board.goats.onHand === 0 &&
        Board.board[Board.selectedPosition[0]][Board.selectedPosition[1]] === 1) {
        const row = Board.selectedPosition[0]
        const col = Board.selectedPosition[1]

        console.log("selected position goat", row, col)

        //if the selected position is even
        if (checkEven(Board.selectedPosition)) {
            //we need to check for diagonal too cause the pieces in even places have that choices
            directionChoice = directionsWithDiagonal
        }
        else {
            directionChoice = directions
        }
        for (const direction of directionChoice) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;

            // console.log(newRow,newCol)

            // Check if the new position is within the bounds of the board
            if (newRow >= 0 &&
                newRow < Board.board.length &&
                newCol >= 0 &&
                newCol < Board.board[row].length) {
                // Check if the new position is empty
                if (Board.board[newRow][newCol] === null) {
                    nextValidMoves.push([newRow, newCol])
                }
            }
        }
    }
    //check valid moves when its turn for Tiger to move
    else {
        const row = Board.selectedPosition[0]
        const col = Board.selectedPosition[1]

        console.log("selected position Tiger", row, col)

        //if the selected position is even
        if (checkEven(Board.selectedPosition)) {
            //we need to check for diagonal too cause the pieces in even places have that choices
            directionChoice = directionsWithDiagonal
        }
        else {
            directionChoice = directions
        }
        for (const direction of directionChoice) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;

            //one more step in a straight line
            const newKillRow = newRow + direction.row;
            const newKillCol = newCol + direction.col;

            // console.log("new", newRow, newCol)
            // console.log("newkill", newKillRow, newKillCol)

            // Check if the new position is within the bounds of the board
            if (newRow >= 0 &&
                newRow < Board.board.length &&
                newCol >= 0 &&
                newCol < Board.board[row].length
            ) {
                // Check if the new position is empty
                if (Board.board[newRow][newCol] === null) {
                    // nextValidMoves.push([newRow, newCol, "move"])
                    nextValidMoves.push([newRow, newCol])
                    // console.log("push new", newRow, newCol)
                }
                //if killing a goat is possible by going over the goat position in a straight line
                else if (Board.board[newRow][newCol] === 1) {
                    //check if it is in bound of board
                    if (newKillRow >= 0 &&
                        newKillRow < Board.board.length &&
                        newKillCol >= 0 &&
                        newKillCol < Board.board[row].length
                    ) {
                        if (Board.board[newKillRow][newKillCol] === null) {
                            // nextValidMoves.push([newKillRow, newKillCol, "kill"])
                            nextValidMoves.push([newKillRow, newKillCol])
                            // console.log("push newkill", newKillRow, newKillCol)
                        }
                    }
                }
            }
        }
    }
    return (nextValidMoves);
}

gameOver = (Board) => {
    // condn. 1 => killed 5 goats
    if (Board.goats.killed >= 5) {
        return 1;
    }
    //condn. 2 => goats have no valid moves  (if game has atleast one goat with a valid place to move than game not over)
    else if (Board.goats.onHand === 0) {
        validMovenumber = 0;
        for (let row = 0; row < Board.board.length && validMovenumber === 0; row++) {
            for (let col = 0; col < Board.board[row].length && validMovenumber === 0; col++) {
                if (Board.board[row][col] === null) {

                    if (checkEven(row, col)) {
                        //we need to check for diagonal too cause the pieces in even places have that choices
                        directionChoice = directionsWithDiagonal
                    }
                    else {
                        directionChoice = directions
                    }
                    for (const direction of directionChoice) {
                        const newRow = row + direction.row;
                        const newCol = col + direction.col;

                        if (newRow >= 0 &&
                            newRow < Board.board.length &&
                            newCol >= 0 &&
                            newCol < Board.board[row].length &&
                            Board.board[newRow][newCol] === 1
                        ) {
                            validMovenumber++;
                            break;
                        }
                    }
                }
            }
        }
        if (validMovenumber === 0) {
            console.log("validMovenumber", validMovenumber)
            return 1
        }
    }
    //condn. 3 => all tigers are trapped
    else if (Board.tigers.trapped.length === 4) {
        return 2;
    }
    // the game is not over
    return 0;
}

// console.log(validMove(Board))
// playgame()
console.log(gameOver(Board))