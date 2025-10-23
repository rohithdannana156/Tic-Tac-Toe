let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGame = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let singleBtn = document.querySelector("#single-btn");
let multiBtn = document.querySelector("#multi-btn");
let modeSelection = document.querySelector(".mode-selection");

let mode = ""; // "single" or "multi"
let player = "O"; // Human
let ai = "X";     // AI
let turnO = true;
let count = 0;

const winPattern = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Mode selection
singleBtn.addEventListener("click", () => startGame("single"));
multiBtn.addEventListener("click", () => startGame("multi"));

function startGame(selectedMode) {
    mode = selectedMode;
    modeSelection.style.display = "none"; // hide mode selection
    document.querySelector("main").style.display = "block"; // show game
    resetGame();
}

// Box clicks
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(box.innerText !== "" || !turnO) return;

        if(mode === "multi") {
            box.innerText = turnO ? "O" : "X";
            box.disabled = true;
            count++;
            if(checkWinner() || count === 9) {
                if(count === 9 && !checkWinner()) gameDraw();
                return;
            }
            turnO = !turnO; // switch turn
        }

        if(mode === "single") {
            makeMove(box, player);
            if(checkWinner() || count === 9) {
                if(count === 9 && !checkWinner()) gameDraw();
                return;
            }
            turnO = false;
            setTimeout(aiTurn, 300);
        }
    });
});

// Functions for single player AI
const makeMove = (box, symbol) => {
    box.innerText = symbol;
    box.disabled = true;
    count++;
};

const aiTurn = () => {
    let bestMoveIndex = getBestMove();
    if(bestMoveIndex !== null) {
        makeMove(boxes[bestMoveIndex], ai);
    }
    if(checkWinner() || count === 9) {
        if(count === 9 && !checkWinner()) gameDraw();
        return;
    }
    turnO = true;
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let move = null;
    boxes.forEach((box, index) => {
        if(box.innerText === "") {
            box.innerText = ai;
            let score = minimax(false);
            box.innerText = "";
            if(score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    return move;
};

const minimax = (isMaximizing) => {
    let winner = checkWinnerMini();
    if(winner !== null) {
        if(winner === ai) return 10;
        if(winner === player) return -10;
        if(winner === "draw") return 0;
    }

    if(isMaximizing) {
        let bestScore = -Infinity;
        boxes.forEach((box) => {
            if(box.innerText === "") {
                box.innerText = ai;
                let score = minimax(false);
                box.innerText = "";
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        boxes.forEach((box) => {
            if(box.innerText === "") {
                box.innerText = player;
                let score = minimax(true);
                box.innerText = "";
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
};

const checkWinnerMini = () => {
    for(let pattern of winPattern) {
        let [a,b,c] = pattern.map(i => boxes[i].innerText);
        if(a !== "" && a === b && b === c) return a;
    }
    if([...boxes].every(b => b.innerText !== "")) return "draw";
    return null;
};

// Existing helper functions
const gameDraw = () => {
    msg.innerText = 'Game was a Draw!';
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
    count = 0;
};

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    count = 0;
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for(let pattern of winPattern) {
        let [a,b,c] = pattern.map(i => boxes[i].innerText);
        if(a !== "" && a === b && b === c) {
            showWinner(a);
            return true;
        }
    }
    return false;
};

newGame.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
