import Vector from "../server/vector";
import {ballInitialSpeed, ballSize} from "../server/enums";

export default class Ball {
    private ctx: CanvasRenderingContext2D;
    private initialSpeed: number = ballInitialSpeed;
    private pos: Vector;
    private speed: Vector;
    private size: number = ballSize;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.pos = new Vector(.5, .5);
        this.speed = new Vector(this.initialSpeed, this.initialSpeed * .8);
    }

    draw(playerNumber: number) {
        let actualSize = this.size * Math.min(this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
        this.ctx.fillStyle = '#FFFFFF';
        let x = Math.abs((playerNumber === 0?0:1) - this.pos.x);
        this.ctx.fillRect(x * this.ctx.canvas.clientWidth - actualSize / 2, this.pos.y * this.ctx.canvas.clientHeight - actualSize / 2, actualSize, actualSize);
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(x * this.ctx.canvas.clientWidth - 3, this.pos.y * this.ctx.canvas.clientHeight - 3, 6, 6);
    }

    update(delta: number) {
        this.pos.add(this.speed.resMul(delta));
        if(this.pos.x < this.size / 2 || this.pos.x > 1 - this.size / 2) {
            //this.speed.x *= -1;
            //this.pos.x = Math.max(Math.min(this.pos.x, 1 - this.size / 2), this.size / 2);
        }
        if(this.pos.y < this.size / 2 || this.pos.y > 1 - this.size / 2) {
            this.speed.y *= -1;
            this.pos.y = Math.max(Math.min(this.pos.y, 1 - this.size / 2), this.size / 2);
        }
    }

    setPosition(obj: Vector) {
        this.pos.x = obj.x;
        this.pos.y = obj.y;
    }

    setSpeed(obj: Vector) {
        this.speed.x = obj.x;
        this.speed.y = obj.y;
    }
}