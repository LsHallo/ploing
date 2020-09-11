import {Direction, paddleHeight, paddleMove, paddleWidth, Side} from "../server/enums";


export default class Paddle {
    private ctx: CanvasRenderingContext2D;
    public y: number;
    private readonly side: Side;
    private move_amount = paddleMove;
    private width: number = paddleWidth;
    height: number = paddleHeight;

    constructor(side: Side, context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.y = 0.5;
        this.side = side;
    }

    move(direction: Direction, delta: number) {
        this.y += (direction === Direction.UP?-this.move_amount:this.move_amount);
        if(this.y >= 1 - this.height / 2) {
            this.y = 1 - this.height / 2;
        }
        if(this.y <= this.height / 2) {
            this.y = this.height / 2;
        }
    }

    draw() {
        let width = this.width * this.ctx.canvas.clientWidth;
        let height = this.height * this.ctx.canvas.clientHeight;

        let x = this.side === Side.LEFT?width / 2:this.ctx.canvas.clientWidth - width / 2;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x - width / 2, this.y * this.ctx.canvas.clientHeight - height / 2, width, height);
        if((<any>window).debug) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(x - 3, this.y * this.ctx.canvas.clientHeight - 3, 6, 6);
        }
    }
}