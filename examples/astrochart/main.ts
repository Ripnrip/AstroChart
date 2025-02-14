// Import from the window object since the library adds to window.astrochart
declare global {
    interface Window {
        astrochart: {
            Chart: any;
            PlanetCalculator: any;
        }
    }
}

// Create a real-time planetary chart
export class AstroChartExample {
    private chart: any;
    private calculator: any;
    private animationFrame: number;

    constructor(elementId: string, width: number = 800, height: number = 800) {
        if (!window.astrochart) {
            throw new Error('astrochart.js must be loaded first');
        }
        this.chart = new window.astrochart.Chart(elementId, width, height);
        this.calculator = new window.astrochart.PlanetCalculator();
        this.start();
    }

    // ... rest of the class implementation ...
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