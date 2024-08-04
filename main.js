let ms = 750; 
let isPaused = false;
let isSolving = false;
let board;
let currentRow = 0;
let currentCol = 0;

document.querySelector(".submit-btn").addEventListener("click", () => {
    if (!isSolving) {
        isSolving = true;
        let ip = document.querySelector("#queensInput");
        let n = parseInt(ip.value);
        if (n < 4) {
            alert("N should be more than 3");
            n = 0;
            ip.value = 4;
        }
        board = createBoard(n);
        solve(board, 0, 0);
    }
});

document.querySelector(".pause-play-btn").addEventListener("click", () => {
    isPaused = !isPaused;
    if (!isPaused) {
        solve(board, currentRow, currentCol);
    }
    document.querySelector(".pause-play-btn").innerText = isPaused ? "Play" : "Pause";
});

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.querySelector(".submit-btn").click();
    }
});

function createBoard(n) {
    let board = new Array(n).fill().map(() => new Array(n).fill(0));

    if (n < 8) {
        ms = 2500; 
    } else if (n < 11) {
        ms = 1500; 
    }
    return board;
}

async function printBoard(board, message) {
    let div = document.querySelector(".body");

    div.innerHTML = "";
    let msgRow = document.createElement("tr");
    let msgCell = document.createElement("td");
    msgCell.colSpan = board.length + 1;
    msgCell.textContent = message;
    msgCell.className = 'message-text'; 
    msgRow.appendChild(msgCell);
    div.appendChild(msgRow);
    let headerRow = document.createElement("tr");
    let emptyHeaderCell = document.createElement("td");
    headerRow.appendChild(emptyHeaderCell); 
    for (let i = 0; i < board.length; i++) {
        let headerCell = document.createElement("td");
        headerCell.textContent = i + 1;
        headerCell.style.fontWeight = "bold";
        headerCell.style.fontSize = "30px";
        headerRow.appendChild(headerCell);
    }
    div.appendChild(headerRow);

    for (let i = 0; i < board.length; i++) {
        let row = document.createElement("tr");
        let rowNumberCell = document.createElement("td");
        rowNumberCell.textContent = i + 1;
        rowNumberCell.style.fontWeight = "bold";
        rowNumberCell.style.fontSize = "30px";
        row.appendChild(rowNumberCell);

        for (let j = 0; j < board.length; j++) {
            let cell = document.createElement("td");
            cell.classList.add("cell");
            if (board[i][j] == "Q") {
                cell.innerHTML = "<span class='queen-symbol'>♛</span>";
            }
            row.appendChild(cell);
        }

        div.appendChild(row);
    }
}

function isValid(board, row, col) {
    let n = board.length;
    for (let i = 0; i < n; i++) {
        if (board[i][col] == "Q") {
            return false;
        }
    }
    for (let i = 0; i < n; i++) {
        if (board[row][i] == "Q") {
            return false;
        }
    }
    let j = col;
    for (let i = row; i >= 0; i--) {
        if (board[i][j] == "Q") {
            return false;
        }
        j--;
    }
    j = col;
    for (let i = row; i >= 0; i--) {
        if (board[i][j] == "Q") {
            return false;
        }
        j++;
    }
    return true;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function solve(board, row, col) {
    if (row >= board.length) {
        await printBoard(board, "SOLUTION");
        isSolving = false;
        return true;
    }

    for (let c = col; c < board.length; c++) {
        if (isPaused) {
            currentRow = row;
            currentCol = c;
            return;
        }
        if (isValid(board, row, c)) {
            board[row][c] = "Q";
            currentRow = row;
            currentCol = c;
            await printBoard(board, `Placing Queen at (${row+1}, ${c+1})`);
            await sleep(ms);
            if (await solve(board, row + 1, 0)) {
                return true;
            }
            if (isPaused) {
                return;
            }
            board[row][c] = 0;
            await printBoard(board, `Backtracking from (${row+1}, ${c+1})`);
            await sleep(ms);
        }
    }
    return false;
}
