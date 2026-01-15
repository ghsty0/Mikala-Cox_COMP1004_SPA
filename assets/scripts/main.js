import {Sweeper} from "./sweeperScript.js";
//let game = new Sweeper(8,8,10, document.getElementById("gameBoard"))
let game;

function resetGame(){
    if (game){
        game.clearBoard()
    }
    game = new Sweeper(8,8,10, document.getElementById("gameBoard"))
}
resetGame()
window.resetGame = resetGame;
//difficulty changes in this file
//restarting the game handled here