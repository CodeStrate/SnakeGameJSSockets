const BG_COLOUR = "#002233";
const SNAKE_COLOUR = "#cceeff";
const FOOD_COLOUR = "#ff4d4d";

const socket = io('http://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');

newGameButton.addEventListener('click', newGame);

joinGameButton.addEventListener('click', joinGame);

function newGame(){
    socket.emit('newGame');
    init();
}

function joinGame(){
    //get code
    const code = gameCodeInput.value;
    socket.emit('joinGame' , code); //send joingame to server with the code.
    init();
}


let canvas , ctx;

// gamestate moved to server side

function init() {
    //switch screens
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);

}

//send input to backend/server
function keydown(e){
    socket.emit('keydown', e.keyCode);
}
// init(); now we move to multiplayer.


function paintGame(state){
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.player, size, SNAKE_COLOUR);
}

function paintPlayer(playerState, size, colour){
    const snake = playerState.snake;
    
    ctx.fillStyle = colour;
    for ( let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}


function handleInit(msg){
    console.log(msg);
}


function handleGameState(gameState){
    gameState = JSON.parse(gameState); //since gamestate comes down to the server as a string
    requestAnimationFrame(() => paintGame(gameState)); //request expects a function so i gave a inline/anonymous one which calls paintGame
    
}

function handleGameOver(){
    alert("Lose!");
}