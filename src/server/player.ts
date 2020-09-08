export default class Player {
    id: string;
    private io: any;
    ready: boolean;

    constructor(io: any, id: string) {
        this.id = id;
        this.io = io;
        this.ready = false;
    }
}