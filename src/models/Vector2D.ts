class Vector2D {
    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2D): Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    sub(vector: Vector2D): Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    mul(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    div(scalar: number): Vector2D {
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2D {
        const length = this.length();
        return new Vector2D(this.x / length, this.y / length);
    }

    dot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    cross(vector: Vector2D): number {
        return this.x * vector.y - this.y * vector.x;
    }
}

export { Vector2D };