import Player from "./player";
import Ball from "./ball";
import {targetFrameRate} from "./enums";

export default class Game {
    namespace: any;
    running: boolean;
    ball: Ball;
    players: Player[];
    lastUpdate: number;
    private targetUpdate: number = 1000 / targetFrameRate;

    constructor(namespace: any) {
        this.namespace = namespace;
        this.running = false;
        this.players = [null, null];
        this.ball = new Ball();
    }

    playerJoin(id: string) {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i] === null) {
                this.players[i] = new Player(id);
                return;
            }
        }
    }

    playerLeave(id: string) {
        let index = this.players.indexOf(this.getPlayer(id));
        if(index >= 0) {
            this.players[index] = null;
        }
    }

    getPlayer(id: string): Player {
        for(let player of this.players) {
            if(player !== null) {
                if (player.id === id) {
                    return player;
                }
            }
        }
    }

    start() {
        console.log('[Pong]: Game started!');
        this.running = true;
        this.lastUpdate = new Date().getTime();
        this.update();
    }

    update() {
        let time = new Date().getTime();
        let delta = (time - this.lastUpdate) / this.targetUpdate;
        let update = this.ball.update(delta, this.players);
        if(update !== undefined) {
            this.namespace.emit('ball-pos', this.ball.pos);
            this.namespace.emit('ball-speed', this.ball.speed);
            if(update !== -1) {
                this.namespace.emit('score', update);
                if(this.players[update] !== null) {
                    this.players[update].score++;
                }
            }
        }
        this.namespace.emit('server-ball', this.ball.pos);

        setTimeout(this.update.bind(this), this.targetUpdate);
        this.lastUpdate = time;
    }

    full() {
        for(let player of this.players) {
            if(player === null) {
                return false;
            }
        }
        return true;
    }
}