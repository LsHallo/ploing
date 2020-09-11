import io from 'socket.io-client';
import {Direction, targetFrameRate} from "../server/enums";
import Game from "./game";
import Vector from "../server/vector";

let socket = io(window.location.pathname);
let canvas = <HTMLCanvasElement>document.getElementById('game');
canvasSize();
let ctx = canvas.getContext('2d');
let game = new Game(socket, ctx);
let server_ball: Vector = new Vector(0,0);

window.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowUp' || e.code === 'KeyW') {
        game.direction = Direction.UP;
    } else if(e.code === 'ArrowDown' || e.code === 'KeyS') {
        game.direction = Direction.DOWN;
    }
    if(e.code === 'Space') {
        socket.emit('player-ready', true);
    }
});

window.addEventListener('keyup', (e) => {
   if((e.code === 'ArrowUp' || e.code === 'KeyW') && game.direction === Direction.UP) {
       game.direction = Direction.NONE;
   } else if((e.code == 'ArrowDown' || e.code === 'KeyS') && game.direction === Direction.DOWN) {
       game.direction= Direction.NONE;
   }
});

window.addEventListener('resize', (e) => {
    canvasSize();
});

socket.on('connect', () => {
    console.log(socket.id);
});
socket.on('lobby-full', () => {
    canvas.style.display = 'none';
    let refresh = document.createElement('div');
    refresh.innerHTML = '<h2>Lobby full!</h2>Please refresh to reconnect.<br>Or create a <a href="/">new lobby</a>.';
    refresh.style.fontFamily = 'Roboto, Arial, sans-serif';
    refresh.style.fontSize = '3em';
    refresh.style.color = '#eee';
    document.getElementsByTagName('body')[0].appendChild(refresh);
    socket.disconnect();
    //alert('Lobby already full!');
});
socket.on('player-num', (data: number) => {
   game.playerNumber = data;
   console.log('You are player number ' + data);
});
socket.on('game-start', () => {
    console.log('Game start!');
    game.start();
});
socket.on('game-stop', () => {
   console.log('Game stop!');
   game.stop();
});
socket.on('paddle-update', (data: any) => {
    game.paddles[1].y = data;
});
socket.on('ball-pos', (data: any) => {
    game.ball.setPosition(data);
});
socket.on('ball-speed', (data: any) => {
    game.ball.setSpeed(data);
});
socket.on('server-ball', (data: Vector) => {
    server_ball = data;
});
socket.on('score', (data: any) => {
    game.scores[data]++;
});
socket.on('score-initial', (data: any) => {
    game.scores = data;
});
let lastTime = new Date().getTime();
draw();
function draw() {
    requestAnimationFrame(draw);
    game.draw();

    //FPS display
    let time = new Date().getTime();
    ctx.fillStyle = '#C3C3C3';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(Math.round(1000 / (time - lastTime)).toString() + "fps", 2, 20);
    lastTime = time;

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(Math.abs((game.playerNumber === 0?0:1) - server_ball.x) * ctx.canvas.clientWidth, server_ball.y * ctx.canvas.clientHeight, 5, 5);
}

let lastUpdate = new Date().getTime();
update();
function update() {
    let time = new Date().getTime();
    let delta = (time - lastUpdate) / (1000 / targetFrameRate);
    game.update(delta);
    setTimeout(update, 1000 / 60);
    lastUpdate = time;
}

function canvasSize() {
    const padding = 15;
    canvas.width = Math.min(window.innerWidth, window.innerHeight) - padding;
    canvas.height = Math.min(window.innerWidth, window.innerHeight) - padding;
}