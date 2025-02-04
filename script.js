const pubSub = (function() {
    const subscribers = {} // { click: [fn1, fn2], hover: [fn3] }

    const subscribe = (event, callback) => {
        if (!subscribers[event]) {
            subscribers[event] = []
        }
        subscribers[event].push(callback)
    }

    const notify = (event, data) => {
        if (subscribers[event]) {
            subscribers[event].forEach(callback => callback(data))
        }
    }

    return {
        subscribe,
        notify
    }
})();

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
        // Validate the input
        if (coordinate[0] < 0 || coordinate[0] >= board.length || coordinate[1] < 0 || coordinate[1] >= board.length) {
            console.log("This position is invalid.")
            return false
        }
        
        const cell = board[coordinate[0]][coordinate[1]]

        if (cell.isEmpty()) {
            cell.setToken(playerToken)
            return true
        } else {
            console.log("This position is taken.")
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
            return board.flatMap((row) => row.map((cell) => cell.isEmpty())).includes(true)
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

    // Initialize the board
    resetBoard()

    return {
        getBoard,
        placeToken,
        resetBoard,
        printBoard,
        checkWin
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

    // const printNewRound = () => {
    //     gameBoard.printBoard()
    //     console.log(activePlayer.name + "'s turn.")
    // }

    let gameOver = false
    let resultMessage = ""

    const playRound = (position) => {
        if (gameOver) {
            return
        }
        
        if (gameBoard.placeToken(position, activePlayer.token)) {
            const gameState = gameBoard.checkWin(activePlayer.token)
            if (gameState.isGameOver) {
                pubSub.notify("move-made")
                // printNewRound()
                if (gameState.hasWinner) {
                    gameOver = true
                    resultMessage = activePlayer.name + " won!"
                } else {
                    resultMessage = "Players have reached a tie."
                }

                pubSub.notify("game-over", resultMessage)
            } else {
                switchPlayerTurn()
                pubSub.notify("move-made")
                // printNewRound()
            }

            
        }  
    }

    pubSub.subscribe("cell-clicked", ({row, col}) => {
        playRound([row, col])
    })

    const isGameOver = () => {
        return gameOver
    }

    const getResult = () => {
        return resultMessage
    }

    const resetGame = () => {
        gameBoard.resetBoard()

        activePlayer = players[0]
        gameOver = false
        resultMessage = ""
    }

    pubSub.subscribe("request-reset", resetGame)
    
    // printNewRound()

    return {
        getActivePlayer,
        playRound,
        isGameOver,
        getResult,
        resetGame
    }
})()

const gameDisplay = (function() {
    const boardDiv = document.querySelector(".board")
    const turnDiv = document.querySelector(".turn")
    const resultDiv = document.querySelector(".result")
    const resetBtn = document.querySelector(".reset")

    const updateDisplay = () => {
        boardDiv.innerHTML = ""

        const board = gameBoard.getBoard()
        const activePlayer = gameManager.getActivePlayer()

        turnDiv.textContent = activePlayer.name + "'s turn."
        
        for(let i=0; i<board.length; i++) {
            for (let j=0; j<board[i].length; j++) {
                const cellBtn = document.createElement("button")
                cellBtn.classList.add("cell")

                cellBtn.dataset.row = i
                cellBtn.dataset.col = j

                cellBtn.textContent = board[i][j].getToken()

                boardDiv.appendChild(cellBtn)
            }
        }
    }

    const boardClickHandler = (e) => {
        const cell = e.target
        cell.disabled = true

        const row = parseInt(cell.dataset.row)
        const col = parseInt(cell.dataset.col)

        pubSub.notify("cell-clicked", {row, col})
    }
    boardDiv.addEventListener("click", boardClickHandler)

    resetBtn.addEventListener("click", () => {
        pubSub.notify("request-reset")
    })

    pubSub.subscribe("move-made", updateDisplay)
    pubSub.subscribe("request-reset", () => {
        updateDisplay()
        resetBtn.style.display = "none"
        resultDiv.textContent = ""
    })
    pubSub.subscribe("game-over", (message) => {
        turnDiv.textContent = ""
        resultDiv.textContent = message
        resetBtn.style.display = "block"
    })

    updateDisplay()

    return {
        updateDisplay
    }
})()
