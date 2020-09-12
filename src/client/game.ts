import Paddle from "./paddle";
import {Direction, paddleHeight, Side} from "../server/enums";
import Ball from "./ball";

export default class Game {
    private io: any;
    public paddles: Paddle[];
    ball: Ball;
    private readonly ctx: CanvasRenderingContext2D;
    private lastState: number;
    direction: Direction = Direction.NONE;
    playerNumber: number;
    private started: boolean = false;
    scores: number[] = [0, 0];

    constructor(io: any, context: CanvasRenderingContext2D) {
        this.io = io;
        this.ctx = context;
        this.paddles = [new Paddle(Side.LEFT, this.ctx), new Paddle(Side.RIGHT, this.ctx)];
        this.ball = new Ball(this.ctx);
    }

    draw() {
        //Clear
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);

        //Draw center line
        let pieceWidth = 3;
        let pieceHeight = 25;
        this.ctx.fillStyle = '#FFFFFF';
        for(let i = 0; i < this.ctx.canvas.clientHeight / (pieceHeight); i += 2) {
            this.ctx.fillRect(this.ctx.canvas.clientWidth / 2 - pieceWidth / 2, i * pieceHeight, pieceWidth, pieceHeight);
        }

        //Draw paddles
        for(let paddle of this.paddles) {
            paddle.draw();
        }

        //Draw ball
        this.ball.draw(this.playerNumber);
        //const speed = this.ball.getSpeed();
        //this.ctx.fillText('x: ' + Math.round(speed.x * 10000) / 100 + ' y: ' + Math.round(speed.y * 10000) / 100, 0, 60);

        //Draw score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = window.innerHeight * 0.075 + 'px "8 Bit", Arial';
        for(let i = 0; i < this.scores.length; i++) {
            let centerOffset = this.ctx.canvas.clientWidth * 0.03;
            let x = (i === this.playerNumber?-centerOffset+centerOffset/3:centerOffset);
            this.ctx.textAlign = i === this.playerNumber?'end':'start';
            this.ctx.fillText(this.scores[i].toString(), this.ctx.canvas.clientWidth / 2 + x, this.ctx.canvas.clientHeight * 0.077);
        }

        if(!this.started) {
            this.ctx.textAlign = 'left';
            this.ctx.fillText('You', 0,(0.5 - paddleHeight * .65) * this.ctx.canvas.clientHeight);
        }
    }

    update(delta: number) {
        if(this.started) {
            if (this.direction !== Direction.NONE) {
                this.paddles[0].move(this.direction, delta);
            }

            this.ball.update(delta);

            if (this.paddles[0].y != this.lastState) {
                this.io.emit('paddle-update', this.paddles[0].y);
            }
            this.lastState = this.paddles[0].y;
        }
    }

    start() {
        this.started = true;
    }

    stop() {
        this.started = false;
    }
}