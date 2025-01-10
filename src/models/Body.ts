import { Vector2D } from './Vector2D';

class Body {
    constructor(public mass: number, public position: Vector2D, public velocity: Vector2D) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
    }

    applyForce(force: Vector2D, dt: number): void {
        this.velocity = this.velocity.add(force.div(this.mass).mul(dt));
    }

    update(dt: number): void {
        this.position = this.position.add(this.velocity.mul(dt));
    }

    applyGravity(body: Body, dt: number): void {
        const force = body.position.sub(this.position).normalize().mul(this.mass * body.mass / this.position.sub(body.position).length() ** 2);
        this.applyForce(force, dt);
    }
}

export { Body };