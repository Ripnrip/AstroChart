import { Chart } from '../src/index';
import { PlanetCalculator } from '../src/planetCalculator';

export class RealtimeChart {
    private chart: Chart;
    private calculator: PlanetCalculator;
    private animationFrame: number;

    constructor(elementId: string, width: number, height: number) {
        this.chart = new Chart(elementId, width, height);
        this.calculator = new PlanetCalculator();
        
        // Initial cusps data
        const data = {
            planets: this.calculator.calculatePositions(),
            cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        // Draw initial chart
        this.chart.radix(data);
        
        // Start animation loop
        this.update();
    }

    private update = () => {
        const data = {
            planets: this.calculator.calculatePositions(),
            cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };

        this.chart.transit(data);
        this.animationFrame = requestAnimationFrame(this.update);
    }

    public stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
} 