import {Sweeper} from "./sweeperScript.js";
//let game = new Sweeper(8,8,10, document.getElementById("gameBoard"))
let game;
let savedHighScore = 0;
const gameBoard = document.getElementById("gameBoard");
let w = 8;
let h = 8;
let cc = 10;


function setDifficulty(d){
    switch(Number(d.target.value)) {
        case 1:
            w = 8;
            h = 8;
            cc = 10;
            break;
        case 2:
            w = 12;
            h = 12;
            cc = 35;
            break;
        case 3:
            w = 25;
            h = 12;
            cc = 75;
            break;
    }
    resetGame();
}

function resetGame(){
    if (game){
        game.clearBoard();
    }
    const highScore = document.getElementById("highScore").innerHTML
    console.log(highScore)
    if (savedHighScore > highScore){
        game = new Sweeper(w,h,cc, gameBoard, savedHighScore);
    }
    else{
        game = new Sweeper(w,h,cc, gameBoard, highScore);
    }
}

function onHighScoreUploaded(){
    console.log("hell yeah")
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
    console.log("meow:3")
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
    console.log("mrrrow")
}

resetGame();
window.resetGame = resetGame;

gameBoard.addEventListener("gameEnd", (e) => {
    console.log(`game won ${e.detail.winState}`);
});

document.addEventListener("contextmenu", (e) =>{
    e.preventDefault();
});


document.getElementById("difficulty").addEventListener("change", setDifficulty);
document.getElementById("selectFile").addEventListener("change", onHighScoreUploaded);
document.getElementById("downloadFile").addEventListener("click", onDownloadClicked);
//difficulty changes in this file
//restarting the game handled here