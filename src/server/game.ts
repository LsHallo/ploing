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
    lastFps: number;

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

    update() {
        let time = new Date().getTime();
        let delta = (time - this.lastUpdate) / this.targetUpdate;
        let update = this.ball.update(delta, this.players);
        if(update !== undefined) {
            if(update !== -1) {
                this.namespace.emit('ball-update', [this.ball.pos, this.ball.speed, update]);
                //this.namespace.emit('score', update);
                if(this.players[update] !== null) {
                    this.players[update].score++;
                }
            } else {
                this.namespace.emit('ball-update', [this.ball.pos, this.ball.speed]);
            }
        }
        //this.namespace.emit('server-ball', this.ball.pos);

        if(this.running) {
            setTimeout(this.update.bind(this), this.targetUpdate);
        }
        this.lastFps = 1000 / (time - this.lastUpdate);
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

    start() {
        console.log('[Pong]: Game started!');
        this.running = true;
        this.lastUpdate = new Date().getTime();
        this.update();
    }

    stop() {
        this.running = false;
    }
}