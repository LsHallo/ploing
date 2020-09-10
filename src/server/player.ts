export default class Player {
    id: string;
    ready: boolean;
    paddleHeight: number;
    score: number;

    constructor(id: string) {
        this.id = id;
        this.ready = false;
        this.paddleHeight = 0;
        this.score = 0;
    }
}