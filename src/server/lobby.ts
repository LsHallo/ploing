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
            if(this.game.players.length < 2) {
                this.game.playerJoin(socket.id);
                if(this.game.running) {
                    socket.emit('game-start');
                }
            } else {
                socket.emit('lobby-full');
                socket.disconnect();
            }
            socket.on('disconnect', () => {
                console.log("[Socket.IO]: Client '" + socket.id + "' disconnected!");
                this.game.playerLeave(socket.id);
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
                console.log('[Socket.IO]: paddle-update: ' + data);
                for(let player of this.game.players) {
                    if(player.id !== socket.id) {
                        this.namespace.to(player.id).emit('paddle-update', data);
                    }
                }
            });
        });
    }

    allPlayersReady(): boolean {
        let ready = true;
        for(let player of this.game.players) {
            if(!player.ready) {
                ready = false;
            }
        }
        return ready;
    }
}