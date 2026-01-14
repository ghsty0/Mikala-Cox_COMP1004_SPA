export class Sweeper{
    constructor(width, height, catCount, gameBoard){
        this.width = width
        this.height = height
        this.catCount = catCount
        this.gameBoard = gameBoard
        this.cells = []
        this.populateCells()
    }
    populateCells(){
        for (let y = 0; y < this.height; y++){
            for (let x = 0; x < this.width; x++){
                this.createCell(x,y)

            }
            this.gameBoard.appendChild(document.createElement("br"));
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
            isCat: false
        })
        cell.addEventListener("click", () => this.revealCell(x,y));
    }
    revealCell(x,y){}
}

