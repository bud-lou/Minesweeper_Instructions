row_cols = 15;
tile_dims = 25; // pixels (hardcoded in css)
tiles = [];
bombs = [    // row, column (both start at 0)
    [0,0],
    [6,6],
    [6,7],
    [6,8],
    [7,6],
    [14,14]
]

// Create the game board
function createBoard() {
    board = document.getElementById("board");
    // Make sure board is correct size
    board.style.width = row_cols * tile_dims + "px"; // so flexbox will wrap around
    // Generate tiles
    for (let i = 0; i < row_cols * row_cols; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        // Add event listener for tiles
        tile.addEventListener("click", () => mineTile(tile));
        tile.addEventListener("contextmenu", (e) => {  // right click
            e.preventDefault();
            placeFlag(tile);
        });

        tiles.push(tile);
        board.appendChild(tile);
    }
}

function placeFlag(tile) {
    tile.classList.add("flag");
    tile.textContent = "F";
}

function mineTile(tile) {
    tile.classList.add("clicked");

    if (checkForBomb(tile)) {
        tile.classList.add("bomb");
    } else {
        let nearbyBombs = numberNearbyBombs(tile);
        tile.textContent = nearbyBombs > 0 ? nearbyBombs : "";
    }
}

function checkForBomb(tile) {
    let tileIndex = tiles.indexOf(tile);
    let row = Math.floor(tileIndex / row_cols);
    let col = tileIndex % row_cols;
    return bombs.some(bomb => bomb[0] === row && bomb[1] === col);
}

function numberNearbyBombs(tile) {
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
                if (bombs.some(bomb => bomb[0] === neighborRow && bomb[1] === neighborCol)) {
                    count++;
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
}



// Run commands
createBoard();