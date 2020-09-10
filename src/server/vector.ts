export default class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vector) {
        this.x += vec.x;
        this.y += vec.y;
    }

    mul(scaleFactor: number): Vector {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        return this;
    }

    resMul(scale: number): Vector {
        return new Vector(this.x * scale, this.y * scale);
    }
}