import Vector from "./vector";
import {ballInitialSpeed, ballSize, MaxBounceAngle, paddleHeight, paddleWidth} from "./enums";
import Player from "./player";
import {random} from "./random";

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
                let p0PaddleY = players[0].paddleHeight;
                if(this.pos.y > p0PaddleY + paddleHeight / 2 + this.size / 2 ||  this.pos.y < p0PaddleY - paddleHeight / 2 - this.size / 2) {
                    this.pos.x = .5;
                    this.pos.y = .5;
                    this.speed = new Vector(this.initial_speed, this.initial_speed * random(-.6, .6));
                    return 1;
                } else {
                    /*
                    let relativeIntersectY = p0PaddleY - this.pos.y;
                    let normalizedRelativeIntersectY = relativeIntersectY / (paddleHeight / 2);
                    let bounceAngle = normalizedRelativeIntersectY * MaxBounceAngle;
                    this.speed.x = this.initial_speed * Math.cos(bounceAngle);
                    this.speed.y = this.initial_speed * Math.sin(bounceAngle);
                    this.pos.x = this.size / 2 + paddleWidth;*/
                    this.speed.x *= -1;
                    this.pos.x = this.size / 2 + paddleWidth;
                    return -1;
                }
            }
        }
        if(this.pos.x > 1 - this.size / 2 - paddleWidth) {
            if(players[1]) {
                let p1PaddleY = players[1].paddleHeight;
                if(this.pos.y > p1PaddleY + paddleHeight / 2 + this.size / 2 ||  this.pos.y < p1PaddleY - paddleHeight / 2 - this.size / 2) {
                    this.pos.x = .5;
                    this.pos.y = .5;
                    this.speed = new Vector(-this.initial_speed, this.initial_speed * random(-.6, .6));
                    return 0;
                } else {
                    /*let relativeIntersectY = p1PaddleY - this.pos.y;
                    console.log('rel' + relativeIntersectY);
                    let normalizedRelativeIntersectY = relativeIntersectY / (paddleHeight / 2);
                    console.log('norm' + normalizedRelativeIntersectY);
                    let bounceAngle = normalizedRelativeIntersectY * MaxBounceAngle;
                    console.log('ang' + bounceAngle);
                    this.speed.x = -this.initial_speed * Math.cos(bounceAngle);
                    this.speed.y = this.initial_speed * Math.sin(bounceAngle);
                    this.pos.x = 1 - this.size / 2 - paddleWidth;*/
                    this.speed.x *= -1;
                    this.pos.x = 1 - this.size / 2 - paddleWidth;
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