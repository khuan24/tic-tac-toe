const gameBoard = (function() {
    const rows = 3
    const columns = 3
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

    const resetBoard = () => {
        for (let i=0; i<rows; i++) {
            board[i] = []
            for (let j=0; j<columns; j++) {
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

        board.forEach(checkLine)
        const transposedBoard = board[0].map((_, colIndex) => board.map(row => row[colIndex]))
        transposedBoard.forEach(checkLine)
        const diagonals = [board.map((row, i) => row[i]), board.map((row, i) => row[board.length - 1 - i])]
        diagonals.forEach(checkLine)

        
        if (!gameState.hasWinner && !hasEmptyCell(board)) {
            isGameOver = true
        }

        return gameState
    }

    // Initial board construction
    resetBoard()

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
                if (gameState.hasWinner) {
                    console.log(activePlayer.name + " won!")
                } else {
                    console.log("Players have reached a tie.")
                }
                
                gameBoard.resetBoard()
                printNewRound()
            } else {
                switchPlayerTurn()
                printNewRound()
            }
        }  
    }

    const resetGame = () => {
        gameBoard.resetBoard()
        activePlayer = players[0]
    }

    // Initial game message
    printNewRound()

    return {
        getActivePlayer,
        playRound
    }
})()

