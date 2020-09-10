import Vector from "../server/vector";
import {ball_initial_speed, ball_size} from "../server/enums";

export default class Ball {
    private ctx: CanvasRenderingContext2D;
    private initialSpeed: number = ball_initial_speed;
    private pos: Vector;
    private speed: Vector;
    private size: number = ball_size;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        let scaleFactor = this.ctx.canvas.height / 500;
        this.pos = new Vector(.5, .5);
        this.speed = new Vector(this.initialSpeed, this.initialSpeed * .8);
    }

    draw() {
        let actualSize = this.size * Math.min(this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.pos.x * this.ctx.canvas.clientWidth - actualSize / 2, this.pos.y * this.ctx.canvas.clientHeight - actualSize / 2, actualSize, actualSize);
    }

    update(delta: number) {
        this.pos.add(this.speed.resMul(delta));
        if(this.pos.x < this.size / 2 || this.pos.x > 1 - this.size / 2) {
            this.speed.x *= -1;
            this.pos.x = Math.max(Math.min(this.pos.x, 1 - this.size / 2), this.size / 2);
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