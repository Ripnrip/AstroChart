import { useEffect, useRef } from 'react';
import { Chart, PlanetCalculator } from '../../project/src/index';

interface AstroChartProps {
    width?: number;
    height?: number;
    className?: string;
    autoUpdate?: boolean;
}

export const AstroChart: React.FC<AstroChartProps> = ({
    width = 800,
    height = 800,
    className = '',
    autoUpdate = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const animationRef = useRef<number>();
    const calculatorRef = useRef<PlanetCalculator | null>(null);

    useEffect(() => {
        if (containerRef.current && !chartRef.current) {
            // Initialize chart and calculator
            chartRef.current = new Chart(containerRef.current.id, width, height);
            calculatorRef.current = new PlanetCalculator();

            // Initial render
            const data = {
                planets: calculatorRef.current.calculatePositions(),
                cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            };
            
            chartRef.current.radix(data);

            // Start animation if autoUpdate is true
            if (autoUpdate) {
                updateChart();
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [width, height, autoUpdate]);

    const updateChart = () => {
        if (chartRef.current && calculatorRef.current) {
            const data = {
                planets: calculatorRef.current.calculatePositions(),
                cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            };

            chartRef.current.transit(data);
            animationRef.current = requestAnimationFrame(updateChart);
        }
    };

    return (
        <div 
            id="astro-chart-container" 
            ref={containerRef}
            className={className}
            style={{ width, height }}
        />
    );
}; 