import Vector from "./vector";
import {ballInitialSpeed, ballSize, paddleHeight, paddleWidth} from "./enums";
import Player from "./player";

export default class Ball {
    pos: Vector;
    speed: Vector;
    private initial_speed = ballInitialSpeed;
    private size = ballSize;

    constructor() {
        this.pos = new Vector(0.5, 0.5);
        this.speed = new Vector(this.initial_speed, this.initial_speed * 0.8);
    }

    update(delta: number, players: Player[]): number {
        this.pos.add(this.speed.resMul(delta));
        if(this.pos.x < this.size / 2 + paddleWidth) {
            if(players[0]) {
                if(this.pos.y > players[0].paddleHeight + paddleHeight / 2 ||  this.pos.y < players[0].paddleHeight - paddleHeight / 2) {
                    this.pos.x = .5;
                    this.pos.y = .5;
                    this.speed = new Vector(this.initial_speed, this.initial_speed * .8);
                    return 1;
                } else {
                    this.speed.x *= -1;
                    return -1;
                }
            }
        }
        if(this.pos.x > 1 - this.size / 2 - paddleWidth) {
            if(players[1]) {
                if(this.pos.y > players[1].paddleHeight + paddleHeight / 2 ||  this.pos.y < players[1].paddleHeight - paddleHeight / 2) {
                    this.pos.x = .5;
                    this.pos.y = .5;
                    this.speed = new Vector(-this.initial_speed, this.initial_speed * .8);
                    return 0;
                } else {
                    this.speed.x *= -1;
                    return -1;
                }
            }
        }
        if(this.pos.y < this.size / 2 || this.pos.y > 1 - this.size / 2) {
            this.speed.y *= -1;
            this.pos.y = Math.max(Math.min(this.pos.y, 1 - this.size / 2), this.size / 2);
            return -1;
        }
    }
}