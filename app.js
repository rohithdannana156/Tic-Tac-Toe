let boxes=document.querySelectorAll(".box");
let resetBtn=document.querySelector("#reset-btn");
let newGame=document.querySelector("#new-btn");
let msgContainer=document.querySelector(".msg-container");
let msg=document.querySelector("#msg");

let turnO=true;
let count=0;

const winPattern = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        console.log("Box was clicked");
        if(turnO) {
            box.innerText="O";
            turnO=false;
        } else {
            box.innerText="X";
            turnO=true;
        }
        box.disabled=true;
        count++;

        let isWinner=checkWinner();

        if(count === 9 && checkWinner()) {
            gameDraw();
        }
    });
});

const gameDraw = () => {
    msg.innerText='Game was a Draw';
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled=true;
    }
};

const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled=false;
        box.innerText="";
    }
};
const resetGame = () => {
    turnO=true;
    enableBoxes();
    count=0;
    msgContainer.classList.add("hide");
};
const showWinner = (winner) => {
    msg.innerText=`Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
};

const checkWinner = () => {
    for(let pattern of winPattern) {
        let pos1Val=boxes[pattern[0]].innerText;
        let pos2Val=boxes[pattern[1]].innerText;
        let pos3Val=boxes[pattern[2]].innerText;

        if(pos1Val!="" && pos2Val!="" && pos3Val!="") {
            if(pos1Val===pos2Val && pos2Val===pos3Val) {
                disableBoxes();
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

newGame.addEventListener("click",resetGame);
resetBtn.addEventListener("click",resetGame);