import Vector from "./vector";

export default class Game {
    running: boolean;
    ballPos: Vector;

    constructor() {
        this.running = false;
        this.ballPos = new Vector(500, 500);
    }

    start() {
        console.log('[Pong]: Game started!');
        this.running = true;
    }
}