let row_cols = 15;
let tile_dims = 25; // pixels (hardcoded in css)
let game_over = false;
let tiles = [];
let bombs = [    // row, column (both start at 0)
    [0,0],
    [6,6],
    [6,7],
    [6,8],
    [7,6],
    [14,14]
]

// Create the game board
function createBoard() {
    let board = document.getElementById("board");
    // Make sure board is correct size
    board.style.width = row_cols * tile_dims + "px"; // so flexbox will wrap around
    // Generate tiles
    for (let i = 0; i < row_cols * row_cols; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        // Add event listener for tiles
        tile.addEventListener("click", (event) => {
            if (game_over) 
                return;

            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                placeOrRemoveFlag(tile);
            } else {
                mineTile(tile);
            }
        });
        tile.addEventListener("contextmenu", (e) => {  // right click
            if (game_over) 
                return;

            e.preventDefault();
            placeOrRemoveFlag(tile);
        });

        tiles.push(tile);
        board.appendChild(tile);
    }
}

function placeOrRemoveFlag(tile) {
    // Ignore tiles that were already clicked
    if (tile.classList.contains("clicked"))
        return;

    if (tile.classList.contains("flag")) {
        tile.classList.remove("flag");
        tile.textContent = "";
    } else {
        tile.classList.add("flag");
        tile.textContent = "F";
    }
}

function mineTile(tile) {
    // Don't mine tiles that were flagged
    if (tile.classList.contains("flag"))
        return;

    // Allow for chording
    let nearbyBombs = numberNearbyItems(tile, "bomb");
    if (tile.classList.contains("clicked")) {
        // only if all surrounding bombs are flagged
        if (nearbyBombs > 0 && nearbyBombs === numberNearbyItems(tile, "flag")) {
            chordTile(tile);
        } else {
            return;
        }
    }

    tile.classList.add("clicked");
    if (checkForBomb(tile)) {
        tile.classList.add("bomb");
        tile.textContent = "B";
        game_over = true;
        document.getElementById("placeholder").textContent = "Game Over!";
    } else {
        tile.textContent = nearbyBombs > 0 ? nearbyBombs : "";
    }
}

function checkForBomb(tile) {
    let tileIndex = tiles.indexOf(tile);
    let row = Math.floor(tileIndex / row_cols);
    let col = tileIndex % row_cols;
    return bombs.some(bomb => bomb[0] === row && bomb[1] === col);
}

function chordTile(tile) {
    // Get all surrounding tiles
    let tileIndex = tiles.indexOf(tile);
    let row = Math.floor(tileIndex / row_cols);
    let col = tileIndex % row_cols;
    
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i > -1 && j > -1 && i < tile_dims && j < tile_dims) {
                let neighborTile = tiles[i * row_cols + j];
                // Leave flagged tiles alone
                if (!neighborTile.classList.contains("flag") && !neighborTile.classList.contains("clicked")) {
                    mineTile(neighborTile); 
                }
            }      
        }
    }
}

function numberNearbyItems(tile, itemType, remove) {  //itemType should be "bomb" or "flag"
    let tileIndex = tiles.indexOf(tile);
    let row = Math.floor(tileIndex / row_cols);
    let col = tileIndex % row_cols;
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let neighborRow = row + i;
            let neighborCol = col + j;
            if (neighborRow >= 0 && neighborRow < row_cols && neighborCol >= 0 && neighborCol < row_cols) {
                if (itemType === "bomb") {
                    if (bombs.some(bomb => bomb[0] === neighborRow && bomb[1] === neighborCol)) {
                        count++;
                    }
                } else if (itemType === "flag") {
                    if (tiles[neighborRow * row_cols + neighborCol].classList.contains("flag")) {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

function resetBoard() {
    // Reset all tile classes
    tiles.forEach(tile => {
        tile.classList.remove("clicked");
        tile.classList.remove("bomb");
        tile.classList.remove("flag");
        tile.textContent = "";
    });

    document.getElementById("placeholder").textContent = "";
    game_over = false;
}


// Run commands
createBoard();