export class Sweeper{
    constructor(width, height, catCount, gameBoard, highScore){
        //Variables to build the gameboard
        this.width = width
        this.height = height
        this.catCount = catCount
        this.gameBoard = gameBoard

        this.highScore = Number(highScore)
        this.cats = 0
        this.pawsLeft = this.catCount
        this.cellsLeft = (this.width * this.height) - this.catCount
        this.cells = []
        this.firstClick = true
        this.gameActive = true
        this.score = 0

        //Gamestate variables
        this.WIN = "You Win! Restart to play again, or try a harder difficulty."
        this.LOSS = "You Lose! Restart to try again, or try an easier difficulty."
        this.RESTART = "Game in Progress"
        this.outcome = this.RESTART
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

        //create Gameboard & Scoreboard
        this.populateCells()
        document.getElementById("OUTCOME").innerHTML = this.outcome
        document.getElementById("score").innerHTML = this.score
        document.getElementById("highScore").innerHTML = this.highScore
        document.getElementById("pawsLeft").innerHTML = this.pawsLeft
    }
    //Filling up the gameboard with cells, each cell is stored as a position in an array.
    populateCells(){
        for (let y = 0; y < this.height; y++){
            const row = document.createElement("div")
            row.classList.add("rows")
            for (let x = 0; x < this.width; x++){
                const cell = this.createCell(x,y)
                row.appendChild(cell)
            }
            this.gameBoard.appendChild(row)
        }
    }
    //Each cell is given a list of attributes. Clicking system implemented with mousedown event.
    createCell(x,y){
        const cell = document.createElement("div")
        cell.classList.add("cell")
        this.gameBoard.appendChild(cell)
        
        this.cells.push({
            x: x,
            y: y,
            element: cell,
            revealed: false,
            isCat: false,
            isFlagged: false,
            clickedCat: false
        })
        
        cell.addEventListener("mousedown", (e) => {
            if (e.button == 0){
                this.revealCell(x,y)
            }
            else if (e.button == 2){
                this.flagCell(x,y)
            }
        })
        return cell
    }

    //This retrieves the x,y position for a cell.
    getCell(x,y){
        return this.cells.find((value) => value.x === x && value.y === y)
    }

    //Handles revealing cells on click. Only runs when the cell is not revealed or flagged.
    revealCell(x,y){
        if (!this.gameActive){return}

        const cell = this.getCell(x,y)
        if (!cell){return}
        if (cell.revealed){return}
        if (cell.isFlagged == true){return}

        //Adds the 'revealed' attribute to the chosen cell. 
        //First click protection - Places cats after the player has made their first move.
        cell.revealed = true
        this.cellsLeft--
        cell.element.classList.add("revealed")
        if (this.firstClick){
            this.placeCats()
            this.firstClick = false
        }
        if (cell.isCat){
            cell.clickedCat = true
            this.endGame(false)
        }
        //If not a cat, increase score, count & display adjacent cats.
        //If there are no adjacent cats, surrounding non-cat cells are revealed until numCats > 0
        else{
            const numCats = this.countAdjacentCats(x,y)
            this.score += 1
            document.getElementById("score").innerHTML = this.score

            if (numCats > 0){
                cell.element.textContent = numCats
            }
            else{
                for (let dy = -1; dy <= 1; dy++){
                    for (let dx = -1; dx <= 1; dx++){
                        if (dx === 0 && dy === 0){continue}
                        this.revealCell(x+dx, y+dy)
                    }
                }
            }

            if (this.cellsLeft <= 0){
                this.endGame(true)
            }
        }

    }

    //Flagging a cell places a paw image marker on it, flagged cells cannot be clicked without being unflagged.
    //Cells can only be flagged if they have not been revealed or they have already placed the maximum number of paws.
    flagCell(x,y){
        if (!this.gameActive){return}

        const cell = this.getCell(x,y)
        if (!cell){return}
        if (cell.revealed){return}

        //Display on the scoreboard how many paws the player has left to use. Update whenever placed/removed.
        //Retrieves the paw image from its filepath and adds it to the cell. Marks the cell as flagged.
        //Alternatively, cell is unflagged, the pawImg element is removed from the cell.
        if (cell.isFlagged == false){
            if (this.pawsLeft <= 0){return}
            this.pawsLeft--
            document.getElementById("pawsLeft").innerHTML = this.pawsLeft

            const pawImage = document.createElement("img")
            pawImage.src = "assets/images/paw.png"
            pawImage.classList.add("pawImg")
            cell.element.appendChild(pawImage)
            cell.isFlagged = true
        }
        else{
            cell.isFlagged = false
            this.pawsLeft++
            document.getElementById("pawsLeft").innerHTML = this.pawsLeft
            const paws = cell.element.getElementsByClassName("pawImg")
            for (var p of paws){
                p.remove()
            }
        }
    }
    
    //Chooses random x,y coordinates and finds the corresponding cell.
    //If that cell is not revealed or a cat, it is given the isCat attribute.
    //Cats is increased, this repeats until all cats for the chosen difficulty have been placed on the board.
    placeCats(){
        while (this.cats < this.catCount){
            const x = Math.floor(Math.random()*this.width)
            const y = Math.floor(Math.random()*this.height)
            const cell = this.getCell(x,y)

            if (!cell){continue}
            if (cell.revealed){continue}
            if (cell.isCat){continue}

            cell.isCat = true
            this.cats++
        }
    }

    //This is the check to see how many cats are next to a revealed cell.
    //Each cell directly adjacent is checked for the isCat attribute. If applied, adjacentCats is incremented.
    countAdjacentCats(x,y){
        let adjacentCats = 0

        for (let dy = -1; dy <= 1; dy++){
            for (let dx = -1; dx <= 1; dx++){
                if (dx === 0 && dy === 0){continue}

                const cell = this.getCell(x+dx,y+dy)
                if (!cell){continue}
                if (cell.isCat){
                    adjacentCats++
                }
            }
        }
        return adjacentCats
    }

    //The winState can be true or false. Score is added here for additional points
    endGame(winState){
        let i = 0
        let j = 0
        if (winState == false){
            for (i = 0; i < this.width; i++){
                for (j = 0; j < this.height; j++){
                    //Cat cells are filled with a cat image & recoloured for visual representation.
                    //Flagged cats remain flagged to represent correct placement
                    const cell = this.getCell(i,j)
                    const numCats = this.countAdjacentCats(i,j)
                    
                    if (cell.isCat && cell.isFlagged == false){
                        cell.element.classList.add("cat")
                        const catImage = document.createElement("img")
                        catImage.src = "assets/images/cat.png"
                        catImage.classList.add("catImg")
                        cell.element.appendChild(catImage)
                        console.info(cell.element)
                    }
                    //Correctly flagged cats will add +25 score.
                    else if (cell.isCat && cell.isFlagged == true){
                        console.log("Cat Flagged, +25")
                        this.score += 25
                    }

                    //Reveals all other cells on the board.
                    else{
                        if (numCats>0){
                            cell.element.textContent = numCats
                        }

                        cell.revealed = true
                        cell.element.classList.add("revealed") 
                    }
                }
            }

            //Display gamestate on scoreboard
            this.outcome = this.LOSS
            document.getElementById("OUTCOME").innerHTML = this.outcome
        }

        //On a win, player gains +50 score for winning.
        else{
            this.score += 50
            for (i = 0; i < this.width; i++){
                for (j = 0; j < this.height; j++){
                    //On a win, remaining cats are flagged for visual representation
                    //+10 Score for each unflagged cat, +25 score for flagged cats
                    const cell = this.getCell(i,j)

                    if (cell.isCat && cell.isFlagged == false){
                        const pawImage = document.createElement("img")
                        pawImage.src = "assets/images/paw.png"
                        pawImage.classList.add("pawImg")
                        cell.element.appendChild(pawImage)

                        console.log("Cat not flagged, +10")
                        this.score += 10
                    }

                    else if (cell.isCat && cell.isFlagged == true){
                        this.score += 25
                        console.log("Cat Flagged, +25")
                    }
                }
            }

            //Display gamestate on scoreboard
            this.outcome = this.WIN
            document.getElementById("OUTCOME").innerHTML = this.outcome
        }

        //Calculates if score > highscore. If it is, overwrite the highscore to be displayed. Otherwise, nothing changes.
        //Displays final update on scoreboard before it resets.
        //Ends the current game

        this.highScore = Number(document.getElementById("highScore").innerHTML)

        if (this.score > this.highScore){
            this.highScore = this.score
        }

        document.getElementById("score").innerHTML = this.score
        document.getElementById("highScore").innerHTML = this.highScore
        document.getElementById("pawsLeft").innerHTML = this.pawsLeft

        console.log(this.score)
        console.log(this.highScore)

        this.gameBoard.dispatchEvent(winState? this.gameEndedWin: this.gameEndedLoss)
        this.gameActive = false
    }

    //When finished, clear board and destroy game
    clearBoard(){
        this.gameBoard.innerHTML = ""
    }
}