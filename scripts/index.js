const titleScreenManager = (function() {
    const startGameBtn = document.querySelector(".start-game")
    const modal = document.querySelector(".modal")
    const playerForm = document.querySelector("form")
    const formCancelBtn = document.querySelector(".cancel")
    const playerOneName = document.querySelector(".playerOne-name")
    const playerTwoName = document.querySelector(".playerTwo-name")

    startGameBtn.addEventListener("click", () => {
        modal.showModal()
    })

    formCancelBtn.addEventListener("click", () => {
        modal.close()
        playerForm.reset()
    })


})()

