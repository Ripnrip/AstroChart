import { useState, useEffect } from 'react';
import { AstroChart } from './AstroChart';
import { PlanetCalculator } from '../../project/src/index';

// Example structure
interface PlanetaryPosition {
  planet: string;
  longitude: number;
  isRetrograde: boolean;
}

const App: React.FC = () => {
    const [chartSize, setChartSize] = useState(800);
    const [positions, setPositions] = useState<PlanetaryPosition[]>([]);
    const calculator = new PlanetCalculator();

    useEffect(() => {
        // Get positions using PlanetCalculator
        const fetchPositions = () => {
            const planetData = calculator.calculatePositions();
            const formattedPositions = Object.entries(planetData).map(([planet, [position, speed = 1]]) => ({
                planet,
                longitude: position,
                isRetrograde: speed < 0
            }));
            setPositions(formattedPositions);
        };
        
        fetchPositions();
        // Update positions every minute
        const interval = setInterval(fetchPositions, 60000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app">
            <h1>Astrological Chart</h1>
            
            {/* Basic usage */}
            <AstroChart />

            {/* Custom size */}
            <AstroChart 
                width={chartSize} 
                height={chartSize}
                className="custom-chart"
            />

            {/* Display current positions */}
            <div className="positions">
                <h2>Current Planetary Positions</h2>
                {positions.map(pos => (
                    <div key={pos.planet}>
                        {pos.planet}: {pos.longitude.toFixed(2)}° {pos.isRetrograde ? '☿' : ''}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="controls">
                <button onClick={() => setChartSize(prev => prev + 100)}>
                    Increase Size
                </button>
                <button onClick={() => setChartSize(prev => prev - 100)}>
                    Decrease Size
                </button>
            </div>
        </div>
    );
};

export default App; 