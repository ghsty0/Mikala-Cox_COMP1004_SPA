import {Sweeper} from "./sweeperScript.js";
//let game = new Sweeper(8,8,10, document.getElementById("gameBoard"))
let game;
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
    game = new Sweeper(w,h,cc, gameBoard);
}
resetGame();
window.resetGame = resetGame;

gameBoard.addEventListener("gameEnd", (e) => {
    console.log(`game won ${e.detail.winState}`);
});

document.getElementById("difficulty").addEventListener("change", setDifficulty);
//difficulty changes in this file
//restarting the game handled here