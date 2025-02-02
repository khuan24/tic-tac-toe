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

    //construct the board
    for (let i=0; i<rows; i++) {
        board[i] = []
        for (let j=0; j<columns; j++) {
            board[i].push(createCell())
        }
    }

    const getBoard = () => {
        return board
    }

    const placeToken = (coordinate, playerToken) => {
        const cell = board[coordinate[0]][coordinate[1]]
        
        if (cell.isEmpty()) {
            cell.setToken(playerToken)
        } else {
            console.log("This position is taken")
        }

        printBoard()
    }

    // Will be replaced by a render function in gameDisplay
    const printBoard = () => {
        const boardWithTokens = board.map((row) => row.map((cell) => cell.getToken()))
        console.table(boardWithTokens);
    }

    return {
        getBoard,
        placeToken
    }

})()

const gameManager = (function() {

})()

