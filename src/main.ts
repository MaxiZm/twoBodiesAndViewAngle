import { Body } from './models/Body';
import { Vector2D } from './models/Vector2D';
import Chart from 'chart.js/auto';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error('Failed to get 2D context');
}

const width = canvas.width;
const height = canvas.height;

const DT = 1 / 240;
let time: number = 0;

const eye = new Vector2D(width / 4, height / 4);

const body1 = new Body(100000, new Vector2D(width / 2 - 100, height / 2 - 100), new Vector2D(0, 10));
const body2 = new Body(100000, new Vector2D(width / 2 + 100, height / 2 + 100), new Vector2D(0, -10));

const trajectory1: Vector2D[] = [];
const trajectory2: Vector2D[] = [];

const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
const speedValue = document.getElementById('speedValue') as HTMLDivElement;

const speeds = [0.5, 1, 2, 4, 8, 16];
let currentSpeedMultiplier = 1;

speedSlider.addEventListener('input', () => {
    currentSpeedMultiplier = speeds[parseInt(speedSlider.value)];
    speedValue.textContent = `${currentSpeedMultiplier}x`;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    eye.x = event.clientX - rect.left;
    eye.y = event.clientY - rect.top;
    angleChart.data.labels = [];
    angleChart.data.datasets[0].data = [];
    time = 0;
});

function viewAngle(): number {
    let angle = Math.atan2(body2.position.y - eye.y, body2.position.x - eye.x) -
                Math.atan2(body1.position.y - eye.y, body1.position.x - eye.x);
    
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    
    return angle;
}

const angleChart = new Chart(
    document.getElementById('angleChart') as HTMLCanvasElement,
    {
        type: 'line',
        data: {
            labels: [] as string[],
            datasets: [{
                label: 'View Angle',
                data: [] as number[],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 30,
                    ticks: {
                        maxTicksLimit: 6,
                        callback: (value) => `${Number(value).toFixed(1)}s`
                    }
                },
                y: {
                    min: -Math.PI,
                    max: Math.PI,
                    ticks: {
                        callback: (value) => `${(Number(value) * 180 / Math.PI).toFixed(0)}°`
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }
);

setInterval(() => {
    body1.applyGravity(body2, DT * currentSpeedMultiplier);
    body2.applyGravity(body1, DT * currentSpeedMultiplier);
    body1.update(DT * currentSpeedMultiplier);
    body2.update(DT * currentSpeedMultiplier);
    trajectory1.push(body1.position);
    trajectory2.push(body2.position);

    if (trajectory1.length > 1000) {
        trajectory1.shift();
    }
    if (trajectory2.length > 1000) {
        trajectory2.shift();
    }

    const angle = viewAngle();
    time += DT * currentSpeedMultiplier;

    if (angleChart.data.labels && angleChart.data.datasets[0].data) {
        angleChart.data.labels.push(time.toFixed(2));
        angleChart.data.datasets[0].data.push(angle);

        const maxPoints = 30 / DT;
        if (angleChart.data.labels.length > maxPoints) {
            angleChart.data.labels.shift();
            angleChart.data.datasets[0].data.shift();
        } else {
            angleChart.options.scales!.x!.max = Math.max(time, 1);
        }

        angleChart.update();
    }
}, DT * 1000);

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(body1.position.x, body1.position.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(body2.position.x, body2.position.y, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eye.x, eye.y, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(eye.x, eye.y);
    ctx.lineTo(body1.position.x, body1.position.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(eye.x, eye.y);
    ctx.lineTo(body2.position.x, body2.position.y);
    ctx.stroke();

    ctx.beginPath();
    if (trajectory1.length > 0) {
        ctx.moveTo(trajectory1[0].x, trajectory1[0].y);
        for (let i = 1; i < trajectory1.length; i++) {
            ctx.lineTo(trajectory1[i].x, trajectory1[i].y);
        }
    }
    ctx.stroke();

    ctx.beginPath();
    if (trajectory2.length > 0) {
        ctx.moveTo(trajectory2[0].x, trajectory2[0].y);
        for (let i = 1; i < trajectory2.length; i++) {
            ctx.lineTo(trajectory2[i].x, trajectory2[i].y);
        }
    }
    ctx.stroke();
}

setInterval(draw, DT * 1000);