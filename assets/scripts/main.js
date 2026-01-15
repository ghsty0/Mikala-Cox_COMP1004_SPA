import {Sweeper} from "./sweeperScript.js";
//let game = new Sweeper(8,8,10, document.getElementById("gameBoard"))
let game;
const gameBoard = document.getElementById("gameBoard")

function resetGame(){
    if (game){
        game.clearBoard()
    }
    game = new Sweeper(8,8,10, gameBoard)
}
resetGame()
window.resetGame = resetGame;

gameBoard.addEventListener("gameEnd", (e) => {
    e.detail.winState
    console.log(`game won ${e.detail.winState}`)
})

//difficulty changes in this file
//restarting the game handled here