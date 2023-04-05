const { GRID_SCALE } = require('./constants');

function createGameState(){
    return {
        player: {
            position: {
                x: 3,
                y: 10,
            },
            velocity: {
                x: 1,
                y: 0,
            },
            snake: [
                {x:1, y: 10},
                {x:2, y: 10},
                {x:3, y: 10},
    
            ],
        },
        food: {
            x: 7,
            y: 7,
        },
        gridSize: GRID_SCALE,
    };
}

function gameLoop(state){
    if(!state) return;

    const playerOne = state.player;
    //move player by vel

    playerOne.position.x += playerOne.velocity.x;
    playerOne.position.y += playerOne.velocity.y;

    //constrain to canvas
    if(playerOne.position.x < 0 || playerOne.position.x > GRID_SCALE || playerOne.position.y < 0 || playerOne.position.y > GRID_SCALE){
        return 2; // for multiplayer
    }

    if(state.food.x === playerOne.position.x && state.food.y === playerOne.position.y){ //eating food
        playerOne.snake.push({...playerOne.position}); //adding 1 to current snake array
        playerOne.position.x += playerOne.velocity.x;
        playerOne.position.y += playerOne.velocity.y;
        randomFood(state);
    }

    //if snake hasn't bumped into itself
    if(playerOne.velocity.x || playerOne.velocity.y){
        for (let cell of playerOne.snake){
            //shifting
            if(cell.x === playerOne.position.x && cell.y === playerOne.position.y) { //basically cell overlapping the head
                return 2; //playerOne lost
            }
        }

        playerOne.snake.push({...playerOne.position});
        playerOne.snake.shift(); //pushing and popping in these 2 lines
    }

    return false; //no winner
}

function randomFood(state){
    food = {
        x: Math.floor(Math.random() * GRID_SCALE),
        y: Math.floor(Math.random() * GRID_SCALE),

    }

    state.food = food;

    //now we make sure the food doesnt spawn over the snake
    //loop
    for(let cell of state.player.snake){
        if(cell.x === food.x && cell.y === food.y){
            return randomFood(state);
        }
    }
}

function getUpdatedVelocity(keyCode){
    switch(keyCode){
        case 37: { //left
            return {x: -1 , y: 0};
        }
        case 38: { //up
            return {x: 0 , y: -1};
        }
        case 39: { //right
            return {x: 1 , y: 0};
        }
        case 40: {
            return {x: 0 , y: 1};
        }
    }
}

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
}