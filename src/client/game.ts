import Paddle from "./paddle";
import {Direction, Side} from "../server/enums";
import Ball from "./ball";

export default class Game {
    private io: any;
    public paddles: Paddle[];
    ball: Ball;
    private readonly ctx: CanvasRenderingContext2D;
    private lastState: number;
    direction: Direction;
    playerNumber: number;
    private started: boolean;
    scores: number[] = [0, 0];

    constructor(io: any, context: CanvasRenderingContext2D) {
        this.io = io;
        this.ctx = context;
        this.paddles = [new Paddle(Side.LEFT, this.ctx), new Paddle(Side.RIGHT, this.ctx)];
        this.ball = new Ball(this.ctx);
        this.direction = Direction.NONE;
        this.started = false;
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

        //Draw score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '30px "8 Bit", Arial';
        for(let i = 0; i < this.scores.length; i++) {
            let x = i === 0?-35:35;
            this.ctx.textAlign = i === 0?'right':'left';
            this.ctx.fillText(this.scores[i].toString(), this.ctx.canvas.clientWidth / 2 + x, 40);
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
        console.log('start game');
        this.started = true;
    }
}