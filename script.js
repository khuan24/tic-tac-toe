const gameBoard = (function() {
    const boardLength = 3
    const board = []

    function createCell() {
        let token = "" 
    
        const setToken = (playerToken) => {
            token = playerToken
        }
    
        const getToken = () => {
            return token
        }
    
        const isEmpty = () => {
            if (token == "") {
                return true
            } else {
                return false
            }
        }

        return {
            setToken,
            getToken,
            isEmpty
        }
    }
    
    // Create an empty board
    const resetBoard = () => {
        for (let i=0; i<boardLength; i++) {
            board[i] = []
            for (let j=0; j<boardLength; j++) {
                board[i].push(createCell())
            }
        }
    }

    const getBoard = () => {
        return board
    }

    const placeToken = (coordinate, playerToken) => {
        const cell = board[coordinate[0]][coordinate[1]]
        
        if (cell.isEmpty()) {
            cell.setToken(playerToken)
            return true
        } else {
            console.log("This position is taken")
            return false
        }
    }

    // Will be replaced by a render function in gameDisplay
    const printBoard = () => {
        const boardWithTokens = board.map((row) => row.map((cell) => cell.getToken()))
        console.table(boardWithTokens);
    }

    const checkWin = (playerToken) => {
        const gameState = {
            isGameOver: false,
            hasWinner: false
        }

        const checkLine = (line) => {
            if (line.every((cell) => cell.getToken() == playerToken)) {
                gameState.isGameOver = true
                gameState.hasWinner = true
            }
        }

        const hasEmptyCell = (board) => {
            const flatBoard = [].concat(...board.map((row) => row.map((cell) => cell.isEmpty())))
            return flatBoard.includes(true)
        }

        // Check by row
        board.forEach(checkLine)
        // Check by column
        const transposedBoard = board[0].map((_, colIndex) => board.map(row => row[colIndex]))
        transposedBoard.forEach(checkLine)
        // Check by diagonals
        const diagonals = [board.map((row, i) => row[i]), board.map((row, i) => row[board.length - 1 - i])]
        diagonals.forEach(checkLine)

        // Check for a tie
        if (!gameState.hasWinner && !hasEmptyCell(board)) {
            gameState.isGameOver = true
        }

        return gameState
    }

    return {
        getBoard,
        placeToken,
        resetBoard,
        checkWin,
        printBoard
    }

})()

const gameManager = (function() {
    const players = [
        {
            name: "Player One",
            token: "X"
        },
        {
            name: "Player Two",
            token: "O"
        }
    ]

    let activePlayer = players[0]

    const getActivePlayer = () => {
        return activePlayer
    }

    const switchPlayerTurn = () => {
        if (activePlayer == players[0]) {
            activePlayer = players[1]
        } else {
            activePlayer = players[0]
        }
    }

    const printNewRound = () => {
        gameBoard.printBoard()
        console.log(activePlayer.name + "'s turn.")
    }

    const playRound = (position) => {
        if (gameBoard.placeToken(position, activePlayer.token)) {
            const gameState = gameBoard.checkWin(activePlayer.token)
            if (gameState.isGameOver) {
                printNewRound() // displays the final board
                if (gameState.hasWinner) {
                    console.log(activePlayer.name + " won!")
                } else {
                    console.log("Players have reached a tie.")
                }
                
                resetGame()
                switchPlayerTurn() // the loser now gets the first turn
            } else {
                switchPlayerTurn()
                printNewRound()
            }
        }  
    }

    const resetGame = () => {
        gameBoard.resetBoard()
        printNewRound()
    }

    return {
        getActivePlayer,
        playRound,
        resetGame
    }
})()

// Start a fresh game
gameManager.resetGame()

