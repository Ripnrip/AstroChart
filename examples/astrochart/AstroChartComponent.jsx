import { useEffect, useRef, useState } from 'react';
import './styles.css';

export function AstroChartComponent() {
    const [chart, setChart] = useState(null);
    const chartInitialized = useRef(false);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        // Load astrochart script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@astrodraw/astrochart';
        script.async = true;
        script.onload = () => {
            scriptLoaded.current = true;
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            if (chart) {
                chart.stop();
            }
        };
    }, []);

    const handleStart = () => {
        if (!chartInitialized.current && scriptLoaded.current && window.astrochart) {
            const { Chart, PlanetCalculator } = window.astrochart;
            const calculator = new PlanetCalculator();
            const newChart = new Chart('chart', 800, 800);
            
            // Initial render
            const data = {
                planets: calculator.calculatePositions(),
                cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            };
            
            newChart.radix(data);
            setChart(newChart);
            chartInitialized.current = true;
        }
    };

    const handleStop = () => {
        if (chart) {
            chart.stop();
            setChart(null);
            chartInitialized.current = false;
        }
    };

    return (
        <div className="container">
            <h1>AstroChart Demo</h1>
            <div className="controls">
                <button onClick={handleStart}>Start</button>
                <button onClick={handleStop}>Stop</button>
            </div>
            <div id="chart"></div>
        </div>
    );
} 