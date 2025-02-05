const titleScreenManager = (function() {
    const startGameBtn = document.querySelector(".start-game")
    const modal = document.querySelector(".modal")
    const playerForm = document.querySelector("form")
    const formCancelBtn = document.querySelector(".cancel")
    const playerOneName = document.querySelector("#playerOne-name")
    const playerTwoName = document.querySelector("#playerTwo-name")

    startGameBtn.addEventListener("click", () => {
        modal.showModal()
    })

    formCancelBtn.addEventListener("click", () => {
        modal.close()
        playerForm.reset()
    })

    playerForm.addEventListener("submit", () => {
        const formData = {
            playerOneName: playerOneName.value,
            playerTwoName: playerTwoName.value
        }

        localStorage.setItem("gameSettings", JSON.stringify(formData))
        window.location.href = ("./game.html")
    })
})()

