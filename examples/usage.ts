import { Chart, PlanetCalculator } from '../project/src/index';

// Create a real-time planetary chart
export class AstroChartExample {
    private chart: Chart;
    private calculator: PlanetCalculator;
    private animationFrame: number;

    constructor(elementId: string, width: number = 800, height: number = 800) {
        this.chart = new Chart(elementId, width, height);
        this.calculator = new PlanetCalculator();
        this.start();
    }

    private start() {
        // Initial render
        const data = {
            planets: this.calculator.calculatePositions(),
            cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        };
        
        this.chart.radix(data);
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