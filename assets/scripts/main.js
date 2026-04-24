import {Sweeper} from "./sweeperScript.js"
let game
let savedHighScore = 0
const gameBoard = document.getElementById("gameBoard")
let w = 8
let h = 8
let cc = 10


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

function resetGame(){
    if (game){
        game.clearBoard()
    }
    const highScore = document.getElementById("highScore").innerHTML

    if (savedHighScore > highScore){
        game = new Sweeper(w,h,cc, gameBoard, savedHighScore)
    }
    else{
        game = new Sweeper(w,h,cc, gameBoard, highScore)
    }
}

function onHighScoreUploaded(){
    const files = document.getElementById("selectFile").files
    if (files.length <= 0){
        return;
    }
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
        const result = JSON.parse(e.target.result)
        savedHighScore = result.highScore
        document.getElementById("highScore").innerHTML = result.highScore
    }
    fileReader.readAsText(files.item(0))
}

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

resetGame()
window.resetGame = resetGame;

gameBoard.addEventListener("gameEnd", (e) => {
    console.log(`game won ${e.detail.winState}`)
})

document.addEventListener("contextmenu", (e) =>{
    e.preventDefault()
})


document.getElementById("difficulty").addEventListener("change", setDifficulty)
document.getElementById("selectFile").addEventListener("change", onHighScoreUploaded)
document.getElementById("downloadFile").addEventListener("click", onDownloadClicked)