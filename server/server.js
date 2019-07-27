const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const RpsGame = require('./rps-game');

const app = express();
//Path for index.html
const clientPath = `${__dirname}/../client`;
//Allow to display static page
app.use(express.static(clientPath));
const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock)=>{

  if(waitingPlayer){
    new RpsGame(waitingPlayer, sock);
    waitingPlayer = null;
  }
  else{
      waitingPlayer = sock;
      waitingPlayer.emit('message', 'Waiting for an opponent')
    }

  sock.on('message', (text)=>{
    io.emit('message', text);
  });

});

server.on('error', (err)=>{
  console.log("error")
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});
