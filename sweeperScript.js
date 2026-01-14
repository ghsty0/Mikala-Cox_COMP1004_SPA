//Script for the game.
let HEIGHT = 8;
let WIDTH = 8;
let catCount = 10;
const gameBoard = document.getElementById("gameBoard");
let board = [];
let firstClick = true;

//switch case to control the size of the grid + difficulty
//difficulty is defined by the size of the grid
//let D = 1;
/*function difficulty(){
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
}*/

function placeCats(firstRow, firstCol){
    // Place cats randomly
    let catsPlaced = 0;
    while (catsPlaced < catCount){
        const row = Math.floor(Math.random() * HEIGHT);
        const col = Math.floor(Math.random() * WIDTH);
        if (row == firstRow && col == firstCol){
            continue;
        }
        if (!board[row][col].isCat){
            board[row][col].isCat = true;
            catsPlaced++;
        }
    }

    // Calculate counts
    for (let i = 0; i < HEIGHT; i++){
        for (let j = 0; j < WIDTH; j++){
            if (!board[i][j].isCat) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++){
                    for (let dy = -1; dy <= 1; dy++){
                        const ni = i + dx;
                        const nj = j + dy;
                        if (ni >= 0 && ni < HEIGHT && nj >= 0 && nj < WIDTH && board[ni][nj].isCat){
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
}

function initializeBoard(){
    for (let i = 0; i < HEIGHT; i++){
        board[i] = [];
        for (let j = 0; j < WIDTH; j++){
            board[i][j] = {isCat: false, revealed: false, count: 0};
        }
    }
}

function revealCell(row, col) {
    if (row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH || board[row][col].revealed){
        return;
    }

    board[row][col].revealed = true;

    if (firstClick){
        placeCats(row, col);
        firstClick = false;
    }

    if (board[row][col].isCat){
        // Handle game over
        alert("Game Over! You woke up a cat.");
        //gameEnd()
    }
    
    else if(board[row][col].count === 0){
        // If cell has no cats nearby,
        // Reveal adjacent cells
        for (let dx = -1; dx <= 1; dx++){
            for (let dy = -1; dy <= 1; dy++){
                revealCell(row + dx, col + dy);
            }
        }
    }

    renderBoard();
}

function renderBoard(){
    gameBoard.innerHTML = "";

    for (let i = 0; i < HEIGHT; i++){
        for (let j = 0; j < WIDTH; j++){
            const cell = document.createElement("div");
            cell.className = "cell";
            if (board[i][j].revealed){
                cell.classList.add("revealed");
                if (board[i][j].isCat){
                    cell.classList.add("cat");
                    const catImage = document.createElement("img");
                    catImage.src = "creature.png";
                    catImage.classList.add("catImg");
                    cell.appendChild(catImage);
                }
                else if (board[i][j].count > 0){
                    cell.textContent = board[i][j].count;
                }
            }
            cell.addEventListener("click", () => revealCell(i,j));
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
}

function addScore(){
    //this function will be used to accumulate players total score accross consecutive wins
    //score will be displayed on screen and tracked locally for users to beat their own highscores
}

function fullReset(){
    //for when a player loses, their game will need to be fully reset.
}

function partialReset(){
    //when a player wins, only the gameboard will need to be reset.
}

function gameEnd(){
    //ask player to play again or change difficulty (2 buttons)
    //create button restart, pressing should initiate game restart
    //cells return to original state on button click
    //rebuild board to be tried again
    //same process but with difficulty sized down if prompted
}

function winGame(){
    //happens when all non-cat spaces are found
    //invite player to play again or move up a difficulty (2 buttons)
    //player keeps score, board resets, 
    //player can keep on playing and adding to their score until they lose.
    //highscores tracked locally to players on side of screen
}

initializeBoard();
renderBoard();