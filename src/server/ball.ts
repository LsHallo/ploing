import Vector from "./vector";
import {ballInitialSpeed, ballSize, MaxBounceAngle, paddleHeight, paddleWidth, Side} from "./enums";
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
                    //this.speed = this.calcBounceAngle(Side.LEFT, p0PaddleY, this.pos.y);
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
                    //this.speed = this.calcBounceAngle(Side.RIGHT, p1PaddleY, this.pos.y);
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

    //calcBounceAngle(player: Side, paddlePos: number, ballPos: number): number {
        //const relativeIntersect = (ballPos + ballSize - paddlePos + paddleHeight / 2) / (paddleHeight + ballSize);
        //const bounceAngle = normalizedIntersect * MaxBounceAngle;

        //let phi = 0.25 * Math.PI * (2 * relativeIntersect - 1)

        //return this.initial_speed * Math.sin(phi);
    //}

    calcBounceAngle(player: Side, paddlePos: number, ballPos: number): Vector {
        const intersect = (ballPos - paddlePos) / paddleHeight;
        const normalizedIntersect = intersect / (paddleHeight / 2);

        return new Vector(this.initial_speed * Math.cos(normalizedIntersect), this.initial_speed * Math.sin(normalizedIntersect));

    }
}