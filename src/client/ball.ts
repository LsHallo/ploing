import Vector from "../server/vector";

export default class Ball {
    private ctx: CanvasRenderingContext2D;
    private pos: Vector;
    private speed: Vector;
    private size: number = 25;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.pos = new Vector(this.ctx.canvas.clientWidth / 2, this.ctx.canvas.clientHeight / 2);
    }

    draw() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
    }

    update() {

    }
}