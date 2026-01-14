export class Sweeper{
    constructor(width, height, catCount, gameBoard){
        this.width = width
        this.height = height
        this.catCount = catCount
        this.gameBoard = gameBoard
        this.cats = 0
        this.cells = []
        this.firstClick = true
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
        // this.gameBoard.appendChild(cell);
        
        this.cells.push({
            x: x,
            y: y,
            element: cell,
            revealed: false,
            isCat: false
        })
        cell.addEventListener("click", () => this.revealCell(x,y));
        return cell;
    }
    getCell(x,y){
        return this.cells.find((value) => value.x === x && value.y === y)
    }
    revealCell(x,y){
        const cell = this.getCell(x,y)
        if (!cell){return;}
        if (cell.revealed){return;}
        cell.revealed = true;
        cell.element.classList.add("revealed");
        if (this.firstClick){
            this.placeCats();
            this.firstClick = false;
        }
        if (cell.isCat){
            cell.element.classList.add("cat");
            const catImage = document.createElement("img");
            catImage.src = "assets/images/cat.png";
            catImage.classList.add("catImg");
            cell.element.appendChild(catImage);
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
        }

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
}

