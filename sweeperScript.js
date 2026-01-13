//Script for the game.
let HEIGHT = 8;
let WIDTH = 8;
let catCount = 10;
const gameBoard = document.getElementById("gameBoard");
let board = [];

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

function initializeBoard(){
    for (let i = 0; i < HEIGHT; i++){
        board[i] = [];
        for (let j = 0; j < WIDTH; j++){
            board[i][j] = {isCat: false, revealed: false, count: 0};
        }
    }

    // Place cats randomly
    let catsPlaced = 0;
    while (catsPlaced < catCount){
        const row = Math.floor(Math.random() * HEIGHT);
        const col = Math.floor(Math.random() * WIDTH);
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

function revealCell(row, col) {
    if (row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH || board[row][col].revealed){
        return;
    }

    board[row][col].revealed = true;

    if (board[row][col].isCat){
        // Handle game over
        alert("Game Over! You woke up a cat.");
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

initializeBoard();
renderBoard();
