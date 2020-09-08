import io from 'socket.io-client';
import {Direction} from "../server/enums";
import Game from "./game";

let socket = io(window.location.pathname);
let canvas = <HTMLCanvasElement>document.getElementById('game');
canvas.width = Math.min(window.innerWidth, window.innerHeight) - 5;
canvas.height = Math.min(window.innerWidth, window.innerHeight) - 5;
let ctx = canvas.getContext('2d');
let game = new Game(socket, ctx);

window.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowUp') {
        game.direction = Direction.UP;
    } else if(e.code === 'ArrowDown') {
        game.direction = Direction.DOWN;
    }
    if(e.code === 'Space') {
        socket.emit('player-ready', true);
    }
});

window.addEventListener('keyup', (e) => {
   if(e.code === 'ArrowUp' && game.direction === Direction.UP) {
       game.direction = Direction.NONE;
   } else if(e.code == 'ArrowDown' && game.direction === Direction.DOWN) {
       game.direction= Direction.NONE;
   }
});

socket.on('connect', function () {
    console.log(socket.id);
});
socket.on('lobby-full', () => {
    alert('Lobby already full!');
    socket.disconnect();
})
socket.on('game-start', function () {
    game.start();
});

let lastTime = new Date().getTime();
draw();
function draw() {
    requestAnimationFrame(draw);
    game.draw();

    //FPS dispaly
    let time = new Date().getTime();
    ctx.fillText(Math.round(1000 / (time - lastTime)).toString() + "fps", 20, 20);
    lastTime = time;
}

//update();
function update() {
    game.update();
    //setTimeout(update, 1000 / 60);
}