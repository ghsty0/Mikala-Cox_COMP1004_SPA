import {Sweeper} from "./sweeperScript.js"

//Essential for building and holding the gameboard
let game
const gameBoard = document.getElementById("gameBoard")
let savedHighScore = 0

//Standard width, height and catcount. Always starts on easy difficulty.
let w = 8
let h = 8
let cc = 10

//Controls the difficulty based on the value recieved from the HTML dropdown menu.
//Difficulty eventListener communicates these values under the "difficulty" ID
function setDifficulty(d){
    switch(Number(d.target.value)) {
        case 1:
            w = 8
            h = 8
            cc = 10
            break
        case 2:
            w = 12
            h = 12
            cc = 30
            break
        case 3:
            w = 25
            h = 12
            cc = 60
            break
    }
    resetGame()
}

//Runs the clearBoard function from the Sweeper class
//Here the highscore value is controlled. 
//The highscore is only replaced if the saved highscore from a previous game is greater than the current highscore.
//Else, the current highscore is kept.
//The highscore is passed into the Sweeper class on creation. Sweeper class displays this on the scoreboard.
function resetGame(){
    if (game){
        game.clearBoard()
    }

    const highScore = Number(document.getElementById("highScore").innerHTML)
    if (savedHighScore > highScore){
        game = new Sweeper(w,h,cc, gameBoard, savedHighScore)
    }
    else{
        game = new Sweeper(w,h,cc, gameBoard, highScore)
    }
}

//Allows user to upload a file
//Reads the uploaded file, copies the value inside the file to highScore
function onHighScoreUploaded(){
    const files = document.getElementById("selectFile").files
    if (files.length <= 0){
        return
    }

    const fileReader = new FileReader()
    fileReader.onload = (e) => {
        const result = JSON.parse(e.target.result)
        savedHighScore = Number(result.highScore)
        document.getElementById("highScore").innerHTML = savedHighScore
    }

    fileReader.readAsText(files.item(0))
}

//The current highScore is converted to a JSON string and written to a file.
//A downloadable URL is created.
//The anchor allows the file to be downloaded.
function onDownloadClicked(){
    const data = {
        highScore: document.getElementById("highScore").innerHTML
    }

    const blob = new Blob([JSON.stringify(data)],{type: "application/json"})
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = "highScore.json"
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
}

//Reset the game on window startup
//Display the winstate
//Prevent dropdown menu when right clicking
resetGame()
window.resetGame = resetGame

gameBoard.addEventListener("gameEnd", (e) => {
    console.log(`Game Won?: ${e.detail.winState}`)
})

document.addEventListener("contextmenu", (e) =>{
    e.preventDefault()
})

//Connects buttons and dropdown menus from HTML to JS functions
document.getElementById("difficulty").addEventListener("change", setDifficulty)
document.getElementById("selectFile").addEventListener("change", onHighScoreUploaded)
document.getElementById("downloadFile").addEventListener("click", onDownloadClicked)