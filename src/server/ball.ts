import Vector from "./vector";
import {ball_initial_speed, ball_size} from "./enums";

export default class Ball {
    position: Vector;
    speed: Vector;
    private initial_speed = ball_initial_speed;
    private size = ball_size;

    constructor() {
        this.position = new Vector(0.5, 0.5);
        this.speed = new Vector(this.initial_speed, this.initial_speed * 0.8);
    }

    update(delta: number) {
        this.position.add(this.speed.resMul(delta));
        let change = false;
        if(this.position.x < this.size / 2 || this.position.x > 1 - this.size / 2) {
            this.speed.x *= -1;
            this.position.x = Math.max(Math.min(this.position.x, 1 - this.size / 2), this.size / 2);
            change = true;
        }
        if(this.position.y < this.size / 2 || this.position.y > 1 - this.size / 2) {
            this.speed.y *= -1;
            this.position.y = Math.max(Math.min(this.position.y, 1 - this.size / 2), this.size / 2);
            change = true;
        }
        return change;
    }
}