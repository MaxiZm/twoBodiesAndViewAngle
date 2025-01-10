# Two Bodies Gravitational System

An interactive simulation of gravitational interaction between two bodies with viewing angle visualization.

## Demo

View the live demo here: [GitHub Pages Demo](https://maxizm.github.io/twoBodiesAndViewAngle/)

## Features

- Real-time simulation of gravitational interaction between two bodies
- Interactive viewpoint (click anywhere on screen)
- Live graph of viewing angle between bodies
- Adjustable simulation speed (0.5x to 16x)
- Body trajectory visualization

## Technologies

- TypeScript
- Vite
- Chart.js
- HTML5 Canvas

## Installation

```bash
# Clone repository
git clone https://github.com/your-username/twoBodies.git

# Navigate to project directory
cd twoBodies

# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage

1. Open the application in your browser
2. Use the slider in the top-right corner to adjust simulation speed
3. Click anywhere on the screen to move the viewpoint
4. The graph at the bottom shows the viewing angle between the bodies

## Project Structure

```
twoBodies/
├── src/
│   ├── models/
│   │   ├── Body.ts      # Physical body class
│   │   └── Vector2D.ts  # Vector operations class
│   └── main.ts          # Main application code
├── index.html           # Main page
└── vite.config.ts       # Vite configuration
```

## How It Works

The simulation uses basic physics principles:
- Gravitational force between bodies
- Newtonian motion
- Angular calculations for viewing perspective

Key code references:

```18:21:src/models/Body.ts
    applyGravity(body: Body, dt: number): void {
        const force = body.position.sub(this.position).normalize().mul(this.mass * body.mass / this.position.sub(body.position).length() ** 2);
        this.applyForce(force, dt);
    }
```



```46:54:src/main.ts
function viewAngle(): number {
    let angle = Math.atan2(body2.position.y - eye.y, body2.position.x - eye.x) -
                Math.atan2(body1.position.y - eye.y, body1.position.x - eye.x);
    body1.applyGravity(body2, DT * currentSpeedMultiplier);
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    body2.update(DT * currentSpeedMultiplier);
    return angle;
}
```


## Development

- The simulation runs at 240 FPS (`DT = 1/240`)
- Trajectories are limited to 1000 points
- Viewing angle is normalized to [-π, π]
- Chart displays last 30 seconds of angle data

## License

No license
