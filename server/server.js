const express = require("express");
const app = express();
const http = require("http").createServer(app);

//gamestate
const { createGameState, gameLoop, getUpdatedVelocity } = require('./gamecontroller');
//FPS
const { FRAME_RATE } = require('./constants');

// const io = require('socket.io')(http);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

io.on('connection', client => {
    // client.emit('init', {data: 'hello world'});
    const state = createGameState();

    //listen to client input
    client.on('keydown', handleKeyDown);

    function handleKeyDown(keyCode){
        try {
            //parse str code to int
            keyCode = parseInt(keyCode);
        }catch(e){
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);

        if(vel) state.player.velocity = vel;
    }

    startGameInterval(client, state);
});


function startGameInterval(client, state){
    //making a hook id
    const intervalID = setInterval(() => {
        const winner = gameLoop(state); // returns 0 so game continues and 1 if lose in single player

        if(!winner){
            client.emit('gameState' , JSON.stringify(state));
        } else {
            client.emit('gameOver');
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);  // 1000 / framerate gives the waiting time for server between each frame
}

io.listen(3000);