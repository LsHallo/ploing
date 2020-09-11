import {generateId} from './random';
import Game from "./game";

export default class Lobby {
    id: string;
    private io: any;
    private namespace: any;
    private game: Game;

    constructor(io: any) {
        this.id = generateId();
        this.io = io;
        this.namespace = this.io.of('/lobby/' + this.id);
        this.game = new Game(this.namespace);
        this.namespace.on('connection', (socket: any) => {
            console.log("[Socket.IO]: New connection from client: "+ socket.id);
            if(!this.game.full()) {
                this.game.playerJoin(socket.id);
                if(this.game.running) {
                    socket.emit('game-start');
                    this.namespace.emit('score-initial', [this.game.players[0].score, this.game.players[1].score]);
                }
                socket.emit('player-num', this.game.players.indexOf(this.game.getPlayer(socket.id)));
            } else {
                socket.emit('lobby-full');
                socket.disconnect();
            }
            socket.on('disconnect', () => {
                console.log("[Socket.IO]: Client '" + socket.id + "' disconnected!");
                this.game.playerLeave(socket.id);
                this.game.stop();
                this.namespace.emit('game-stop');
            });
            socket.on('player-ready', (data: boolean) => {
                console.log('[Socket.IO]: Player \'' + socket.id + '\' is ready!');
                this.game.getPlayer(socket.id).ready = data;
                if(this.allPlayersReady() && this.game.players.length == 2 && !this.game.running) {
                    this.game.start();
                    this.namespace.emit('game-start');
                }
            });
            socket.on('paddle-update', (data: any) => {
                for(let player of this.game.players) {
                    if(player !== null) {
                        if (player.id !== socket.id) {
                            this.namespace.to(player.id).emit('paddle-update', data);
                        }
                        if(player.id === socket.id) {
                            player.paddleHeight = data;
                        }
                    }
                }
            });
        });
    }

    allPlayersReady(): boolean {
        let ready = true;
        for(let player of this.game.players) {
            if(player !== null) {
                if (!player.ready) {
                    ready = false;
                }
            } else {
                ready = false;
            }
        }
        return ready;
    }
}