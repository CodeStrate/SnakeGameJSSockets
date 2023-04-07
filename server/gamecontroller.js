const { GRID_SCALE } = require('./constants');

function initGame(){
    const state = createGameState();
    randomFood(state);
    return state;  

    //now for every client the food spawns differently.
}

function createGameState() {
    return {
      players: [{
        position: {
          x: 3,
          y: 10,
        },
        velocity: {
          x: 1,
          y: 0,
        },
        snake: [
          {x: 1, y: 10},
          {x: 2, y: 10},
          {x: 3, y: 10},
        ],
      }, {
        position: {
          x: 18,
          y: 10,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        snake: [
          {x: 20, y: 10},
          {x: 19, y: 10},
          {x: 18, y: 10},
        ],
      }],
      food: {}, //food is empty now
      gridsize: GRID_SCALE,
    };
  }

function gameLoop(state){
    if(!state) return;

    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    //move player by vel

    playerOne.position.x += playerOne.velocity.x;
    playerOne.position.y += playerOne.velocity.y;

    playerTwo.position.x += playerTwo.velocity.x;
    playerTwo.position.y += playerTwo.velocity.y;

    //constrain to canvas
    if(playerOne.position.x < 0 || playerOne.position.x > GRID_SCALE || playerOne.position.y < 0 || playerOne.position.y > GRID_SCALE){
        return 2; // for multiplayer
    }
    if(playerTwo.position.x < 0 || playerTwo.position.x > GRID_SCALE || playerTwo.position.y < 0 || playerTwo.position.y > GRID_SCALE){
        return 1; // for multiplayer
    }

    // if players ate food.

    if(state.food.x === playerOne.position.x && state.food.y === playerOne.position.y){ //eating food
        playerOne.snake.push({...playerOne.position}); //adding 1 to current snake array
        playerOne.position.x += playerOne.velocity.x;
        playerOne.position.y += playerOne.velocity.y;
        randomFood(state);
    }

    if(state.food.x === playerTwo.position.x && state.food.y === playerTwo.position.y){ //eating food
        playerTwo.snake.push({...playerTwo.position}); //adding 1 to current snake array
        playerTwo.position.x += playerTwo.velocity.x;
        playerTwo.position.y += playerTwo.velocity.y;
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

    if(playerTwo.velocity.x || playerTwo.velocity.y){
        for (let cell of playerTwo.snake){
            //shifting
            if(cell.x === playerTwo.position.x && cell.y === playerTwo.position.y) { //basically cell overlapping the head
                return 1; //playerTwo lost
            }
        }

        playerTwo.snake.push({...playerTwo.position});
        playerTwo.snake.shift(); //pushing and popping in these 2 lines
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
    for(let cell of state.players[0].snake){
        if(cell.x === food.x && cell.y === food.y){
            return randomFood(state);
        }
    }

    for(let cell of state.players[1].snake){
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
    initGame,
    gameLoop,
    getUpdatedVelocity,
}