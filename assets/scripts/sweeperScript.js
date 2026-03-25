export class Sweeper{
    constructor(width, height, catCount, gameBoard){
        this.width = width
        this.height = height
        this.catCount = catCount
        this.gameBoard = gameBoard
        this.cats = 0
        this.cellsLeft = (this.width * this.height) - this.catCount
        this.cells = []
        this.firstClick = true
        this.gameActive = true
        this.gameEndedLoss = new CustomEvent("gameEnd", {
            detail: {
                winState: false,
                game: this
            }
        })
        this.gameEndedWin = new CustomEvent("gameEnd", {
            detail: {
                winState: true,
                game: this
            }
        })
        this.populateCells()
    }
    populateCells(){
        for (let y = 0; y < this.height; y++){
            const row = document.createElement("div");
            row.classList.add("rows");
            for (let x = 0; x < this.width; x++){
                const cell = this.createCell(x,y)
                row.appendChild(cell)
            }
            this.gameBoard.appendChild(row);
        }
    }
    createCell(x,y){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        this.gameBoard.appendChild(cell);
        
        this.cells.push({
            x: x,
            y: y,
            element: cell,
            revealed: false,
            isCat: false,
            isFlagged: false,
            clickedCat: false
        })
        //cell.addEventListener("click", () => this.revealCell(x,y));
        cell.addEventListener("mousedown", (event) => {
            if (event.button == 0){
                this.revealCell(x,y);
                console.log(': left button!');
            }
            else if (event.button == 1){
                console.log(': middle button!');
            }
            else if (event.button == 2){
                this.flagCell(x,y);
                console.log(': right button!');
            }
        });
        return cell;
    }
    getCell(x,y){
        return this.cells.find((value) => value.x === x && value.y === y)
    }
    revealCell(x,y){
        if (!this.gameActive){
            return;
        }
        const cell = this.getCell(x,y)
        if (!cell){return;}
        if (cell.revealed){return;}
        cell.revealed = true;
        this.cellsLeft--;
        cell.element.classList.add("revealed");
        if (this.firstClick){
            this.placeCats();
            this.firstClick = false;
        }
        if (cell.isCat){
            window.alert("woke up a cat");
            cell.clickedCat = true;
            this.endGame(false);
        }
        else{
            const numCats = this.countAdjacentCats(x,y);
            if (numCats > 0){
                cell.element.textContent = numCats;
            }
            else{
                for (let dy = -1; dy <= 1; dy++){
                    for (let dx = -1; dx <= 1; dx++){
                        if (dx === 0 && dy === 0){continue;}
                        this.revealCell(x+dx, y+dy)
                    }
                }
            }
            if (this.cellsLeft <= 0){
                this.endGame(true)
            }
        }

    }
    flagCell(x,y){
        if (!this.gameActive){
            return;
        }
        const cell = this.getCell(x,y)
        if (!cell){return;}
        if (cell.revealed){return;}
        if (cell.isFlagged == false){
            const pawImage = document.createElement("img");
            pawImage.src = "assets/images/paw.png";
            pawImage.classList.add("pawImg");
            cell.element.appendChild(pawImage);
            cell.isFlagged = true;
        }
        else{
            cell.isFlagged = false;
        }
        console.log(cell.isFlagged);
    }
    placeCats(){
        while (this.cats < this.catCount){
            const x = Math.floor(Math.random()*this.width)
            const y = Math.floor(Math.random()*this.height)
            const cell = this.getCell(x,y)
            if (!cell){continue;}
            if (cell.revealed){continue;}
            if (cell.isCat){continue;}
            cell.isCat = true;
            this.cats++;
        }
    }
    countAdjacentCats(x,y){
        let adjacentCats = 0;
        for (let dy = -1; dy <= 1; dy++){
            for (let dx = -1; dx <= 1; dx++){
                if (dx === 0 && dy === 0){continue;}
                const cell = this.getCell(x+dx,y+dy)
                if (!cell){continue;}
                if (cell.isCat){
                    adjacentCats++;
                }
            }
        }
        return adjacentCats;
    }
    endGame(winState){
        let i = 0;
        let j = 0;
        if (winState == false){
            for (i = 0; i < this.width; i++){
                for (j = 0; j < this.height; j++){
                    //console.log("height is: ", this.height, "width is: ", this.width);
                    //console.log("i is: ", i, "j is: ", j);
                    const cell = this.getCell(i,j)
                    const numCats = this.countAdjacentCats(i,j);
                    if (cell.isCat && cell.isFlagged == false){
                        cell.element.classList.add("cat");
                        const catImage = document.createElement("img");
                        catImage.src = "assets/images/cat.png";
                        catImage.classList.add("catImg");
                        cell.element.appendChild(catImage);
                        console.info(cell.element);
                    }
                    /*else if (cell.isCat && cell.isFlagged == true){
                        console.log("you flagged a cat")
                    }*/
                    else{
                        if (numCats>0){
                            cell.element.textContent = numCats;
                        }
                        cell.revealed = true;
                        cell.element.classList.add("revealed"); 
                    }
                }
            }
        }
        else{
            for (i = 0; i < this.width; i++){
                for (j = 0; j < this.height; j++){
                    const cell = this.getCell(i,j)
                    if (cell.isCat && cell.isFlagged == false){
                        const pawImage = document.createElement("img");
                        pawImage.src = "assets/images/paw.png";
                        pawImage.classList.add("pawImg");
                        cell.element.appendChild(pawImage);
                    }
                }
            }
        }
        this.gameBoard.dispatchEvent(winState? this.gameEndedWin: this.gameEndedLoss);
        this.gameActive = false;
    }
    clearBoard(){
        //when finish, clear board and destroy game
        this.gameBoard.innerHTML = "";
    }
}
