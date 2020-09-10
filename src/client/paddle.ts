import {Direction, Side} from "../server/enums";


export default class Paddle {
    private ctx: CanvasRenderingContext2D;
    public y: number;
    private readonly side: Side;
    private move_amount = 7.5;
    private width: number = 25;
    height: number = 125;

    constructor(side: Side, context: CanvasRenderingContext2D) {
        this.ctx = context;
        let scaleFactor = this.ctx.canvas.clientHeight / 500;
        this.y = this.ctx.canvas.clientHeight / 2;
        this.side = side;
        this.height *= scaleFactor;
        this.move_amount *= scaleFactor;
    }

    move(direction: Direction, delta: number) {
        this.y += (direction === Direction.UP?-this.move_amount:this.move_amount);
        if(this.y >= this.ctx.canvas.clientHeight - this.height / 2) {
            this.y = this.ctx.canvas.clientHeight - this.height / 2;
        }
        if(this.y <= this.height / 2) {
            this.y = this.height / 2;
        }
    }

    draw() {
        let x = this.side === Side.LEFT?0:this.ctx.canvas.clientWidth - this.width;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x, this.y - this.height / 2, this.width, this.height);
    }
}