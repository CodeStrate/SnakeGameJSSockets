const express = require("express");
const app = express();
const http = require("http").createServer(app);

//changes for multi-room server play
const state = {};
const clientRooms = {};

//gamestate
const { initGame, gameLoop, getUpdatedVelocity } = require('./gamecontroller'); //exports initGame now
//FPS
const { FRAME_RATE } = require('./constants');

//utility
const {generateID} = require('./utils');

const io = require('socket.io')(http, { //changed require to include CORS rules now.
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

io.on('connection', client => {
    // client.emit('init', {data: 'hello world'});

    //state moved and modified in handlenewgame//

    //listen to client input
    client.on('keydown', handleKeyDown);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
    
    function handleNewGame(){
        let roomID = generateID(5);
        clientRooms[client.id] = roomID;
        // console.log(clientRooms);
        //give code to client
        client.emit('gameCode', roomID);


        state[roomID] = initGame(); //now gamestate is not constant but can be passed to multiple clients. differently

        //so basically the gamestate is now children to the global state we just defined at the top. 

        // make client join the room

        client.join(roomID);
        client.number = 1;
        //make room for player one
        client.emit('init', 1);
    }

    function handleJoinGame(roomID){
        //check if game exists
        // grab a room
        const room = io.sockets.adapter.rooms.get(roomID);

        //let all users in the server

        let allUsers;

        if (room){
            allUsers = room.size; //gets all users currently in the room socket.
        }

        //check how many clients

        let numberOfClients = 0;

        if (room){
            numberOfClients = allUsers; //get length of keys in the allusers object.
        }

        //unknown room
        if(numberOfClients === 0){
            client.emit('unknownGame');
            return;
            
        }else if (numberOfClients > 1) {// more than a player
            //currently cant handle more than 1 in join
            client.emit('tooManyPlayers');
            return;
        
        }

        // now we expect we have exactly 1 client waiting to join

        clientRooms[client.id] = roomID;
        client.join(roomID);
        //make it player 2
        client.number = 2;
        client.emit('init', 2); //give the game to player 2 as well.

        startGameInterval(roomID); //for more than 1 player we need intervals. now we dont need state anymore just gameCode can fetch us all socket clients.

    }

    function handleKeyDown(keyCode){
        const roomID = clientRooms[client.id];

        if(!roomID) return;

        try {
            //parse str code to int
            keyCode = parseInt(keyCode);
        }catch(e){
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);

        if(vel){
            state[roomID].players[client.number - 1].velocity = vel;
            // state.player.velocity = vel;
        }
    }

    // startGameInterval(client, state); since we implemented multiplayer we don't need it to start immediately now.
});


function startGameInterval(roomID){
    //making a hook id
    const intervalID = setInterval(() => {
        const winner = gameLoop(state[roomID]); // returns 0 so game continues and 1 if lose in single player, changed to reflect room 

        if(!winner){
            // client.emit('gameState' , JSON.stringify(state));
            emitGameState(roomID, state[roomID]);
        } else {
            emitGameOver(roomID, winner);
            //reset state
            state[roomID] = null;
            // client.emit('gameOver'); we don't need it anymore
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);  // 1000 / framerate gives the waiting time for server between each frame
}

function emitGameState(room, gameState){
    // emit gameover to all clients in that room
    io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner){
    io.sockets.in(room)
    .emit('gameOver', JSON.stringify({winner}));
}

io.listen(process.env.PORT || 3000);