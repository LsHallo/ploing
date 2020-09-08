import {generateId} from './random';
import Player from './player';
import Game from "./game";
import {Direction} from './enums'

export default class Lobby {
    id: string;
    private io: any;
    private namespace: any;
    private players: Player[];
    private game: Game;

    constructor(io: any) {
        this.id = generateId();
        this.io = io;
        this.players = [];
        this.game = new Game();
        this.namespace = this.io.of('/lobby/' + this.id);
        this.namespace.on('connection', (socket: any) => {
            console.log("[Socket.IO]: New connection from client: "+ socket.id);
            if(this.players.length < 2) {
                this.players.push(new Player(this.io, socket.id));
            } else {
                socket.emit('lobby-full');
                socket.disconnect();
            }
            socket.on('disconnect', () => {
                console.log("[Socket.IO]: Client '" + socket.id + "' disconnected!");
                this.players.splice(this.players.indexOf(this.getPlayer(socket.id)), 1);
            });
            socket.on('player-ready', (data: boolean) => {
                console.log('[Socket.IO]: Player \'' + socket.id + '\' is ready!');
                this.getPlayer(socket.id).ready = data;
                if(this.allPlayersReady() && this.players.length == 2) {
                    this.game.start();
                }
            });
            socket.on('direction-update', (data: any) => {
                console.log(<Direction>data);
            });
        });
    }

    getPlayer(id: string): Player {
        for(let player of this.players) {
            if(player.id === id) {
                return player;
            }
        }
    }

    allPlayersReady(): boolean {
        let ready = true;
        for(let player of this.players) {
            if(!player.ready) {
                ready = false;
            }
        }
        return ready;
    }
}