//Script for the game.
let HEIGHT = 0;
let WIDTH = 0;
let catCount = 0;
let D = 1;

const gameboard = document.getElementById("gameboard");

function difficulty(){
    switch (D){
        case 1:
            HEIGHT = 8;
            WIDTH = 8;
            catCount = 10;
            break;
        case 2:
            HEIGHT = 10;
            WIDTH = 10;
            catCount = 12;
            break;
        case 3:
            HEIGHT = 12;
            WIDTH = 12;
            catCount = 15;
            break;
    }
}


