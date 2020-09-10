import Player from "./player";
import Ball from "./ball";
import {target_frame_rate} from "./enums";

export default class Game {
    namespace: any;
    running: boolean;
    ball: Ball;
    players: Player[];
    lastUpdate: number;
    private targetUpdate: number = 1000 / target_frame_rate;

    constructor(namespace: any) {
        this.namespace = namespace;
        this.running = false;
        this.players = [];
        this.ball = new Ball();
    }

    playerJoin(id: string) {
        this.players.push(new Player(id));
    }

    playerLeave(id: string) {
        this.players.splice(this.players.indexOf(this.getPlayer(id)), 1);
    }

    getPlayer(id: string): Player {
        for(let player of this.players) {
            if(player.id === id) {
                return player;
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
        if(this.ball.update(delta)) {
            this.namespace.emit('ball-pos', this.ball.position);
            this.namespace.emit('ball-speed', this.ball.speed);
        }
        this.namespace.emit('server-ball', this.ball.position);

        setTimeout(this.update.bind(this), this.targetUpdate);
        this.lastUpdate = time;
    }
}