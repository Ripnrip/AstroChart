import type { AspectData } from './settings'
import { ephemeris2025, getPlanetPosition } from './data/ephemeris2025'

export interface PlanetPosition {
    position: number
    speed: number
    isRetrograde?: boolean
}

export interface PlanetData {
    [key: string]: [number] | [number, number] // [position] or [position, speed]
}

interface DailyPositions {
    [key: string]: {
        positions: number[]  // Array of 365 positions, one for each day
        isRetrograde: boolean[]  // Array of 365 booleans indicating retrograde motion
    }
}

export interface AspectInfo {
    aspect: string
    precision: number
    planet1: string
    planet2: string
    angle: number
}

export class PlanetCalculator {
    private lastUpdate: number;
    private dailyPositions2025: DailyPositions;
    private aspects: Record<string, AspectData>;
    
    constructor() {
        this.lastUpdate = Date.now();
        
        // Define aspects configuration
        this.aspects = {
            conjunction: { degree: 0, orbit: 10, color: 'transparent' },
            opposition: { degree: 180, orbit: 10, color: '#27AE60' },
            trine: { degree: 120, orbit: 8, color: '#27AE60' },
            square: { degree: 90, orbit: 8, color: '#FF4500' },
            sextile: { degree: 60, orbit: 6, color: '#27AE60' }
        };

        // Initialize daily positions (sample - you would populate this with actual ephemeris data)
        this.initializeDailyPositions();
    }

    private initializeDailyPositions() {
        // This would ideally be loaded from a data file containing precise daily positions
        this.dailyPositions2025 = {
            "Sun": { positions: new Array(365), isRetrograde: new Array(365).fill(false) },
            "Moon": { positions: new Array(365), isRetrograde: new Array(365).fill(false) },
            "Mercury": { positions: new Array(365), isRetrograde: new Array(365) },
            "Venus": { positions: new Array(365), isRetrograde: new Array(365) },
            "Mars": { positions: new Array(365), isRetrograde: new Array(365) },
            "Jupiter": { positions: new Array(365), isRetrograde: new Array(365) },
            "Saturn": { positions: new Array(365), isRetrograde: new Array(365) },
            "Uranus": { positions: new Array(365), isRetrograde: new Array(365) },
            "Neptune": { positions: new Array(365), isRetrograde: new Array(365) },
            "Pluto": { positions: new Array(365), isRetrograde: new Array(365) }
        };

        // Populate with actual daily positions from ephemeris
        // This is where you would load the precise daily positions for 2025
        this.loadDailyPositions();
    }

    private loadDailyPositions() {
        // Here you would load actual daily positions from your data source
        // For now, we'll use a simple interpolation as placeholder
        for (const planet in this.dailyPositions2025) {
            let currentPos = this.getStartPosition(planet);
            const dailyMotion = this.getDailyMotion(planet);
            
            for (let day = 0; day < 365; day++) {
                this.dailyPositions2025[planet].positions[day] = this.normalizeAngle(currentPos);
                currentPos += dailyMotion;
                
                // Simulate retrograde periods (this should be replaced with actual retrograde data)
                this.dailyPositions2025[planet].isRetrograde[day] = this.isRetrogradePeriod(planet, day);
            }
        }
    }

    private getStartPosition(planet: string): number {
        // Initial positions for Jan 1, 2025
        const startPositions: Record<string, number> = {
            "Sun": 280.5,
            "Moon": 125.3,
            "Mercury": 265.2,
            "Venus": 305.8,
            "Mars": 98.4,
            "Jupiter": 35.2,
            "Saturn": 5.9,
            "Uranus": 44.8,
            "Neptune": 355.2,
            "Pluto": 298.6
        };
        return startPositions[planet] || 0;
    }

    // Add a method to get position for specific date in 2025
    private get2025Position(planet: string, dayOfYear: number): number {
        // Monthly positions for 2025 (first day of each month)
        const positions2025: Record<string, number[]> = {
            "Sun": [280.5, 311.2, 341.6, 11.6, 41.6, 71.5, 101.5, 131.5, 161.5, 191.5, 221.5, 251.5],
            "Moon": [125.3, 138.5, 151.7, 164.9, 178.1, 191.3, 204.5, 217.7, 230.9, 244.1, 257.3, 270.5],
            "Mercury": [265.2, 292.3, 325.6, 355.8, 25.4, 48.9, 82.3, 115.6, 142.8, 168.9, 195.6, 228.9],
            "Venus": [305.8, 335.9, 5.9, 35.9, 65.9, 95.9, 125.9, 155.9, 185.9, 215.9, 245.9, 275.9],
            "Mars": [98.4, 113.2, 128.0, 142.8, 157.6, 172.4, 187.2, 202.0, 216.8, 231.6, 246.4, 261.2],
            "Jupiter": [35.2, 36.9, 38.6, 40.3, 42.0, 43.7, 45.4, 47.1, 48.8, 50.5, 52.2, 53.9],
            "Saturn": [5.9, 6.9, 7.9, 8.9, 9.9, 10.9, 11.9, 12.9, 13.9, 14.9, 15.9, 16.9],
            "Uranus": [44.8, 45.2, 45.6, 46.0, 46.4, 46.8, 47.2, 47.6, 48.0, 48.4, 48.8, 49.2],
            "Neptune": [355.2, 355.5, 355.8, 356.1, 356.4, 356.7, 357.0, 357.3, 357.6, 357.9, 358.2, 358.5],
            "Pluto": [298.6, 298.8, 299.0, 299.2, 299.4, 299.6, 299.8, 300.0, 300.2, 300.4, 300.6, 300.8]
        };

        const month = Math.floor(dayOfYear / 30);
        const dayInMonth = dayOfYear % 30;
        const monthPos = positions2025[planet][month];
        const nextMonthPos = positions2025[planet][(month + 1) % 12];
        
        return this.interpolateAngles(monthPos, nextMonthPos, dayInMonth / 30);
    }

    public calculatePositions(): PlanetData {
        const now = new Date();
        // Map current date to 2025
        const date2025 = new Date(2025, now.getMonth(), now.getDate());
        
        const result: PlanetData = {};
        const planets = Object.keys(ephemeris2025);
        
        for (const planet of planets) {
            const [position, isRetrograde] = getPlanetPosition(planet, date2025);
            result[planet] = [position, isRetrograde ? -1 : 1];
        }
        
        return result;
    }

    public calculateAspects(): AspectInfo[] {
        const positions = this.calculatePositions();
        const aspects: AspectInfo[] = [];
        
        const planets = Object.keys(positions);
        
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                const pos1 = positions[planet1][0];
                const pos2 = positions[planet2][0];
                
                const foundAspects = this.checkAspects(planet1, pos1, planet2, pos2);
                aspects.push(...foundAspects);
            }
        }
        
        return aspects.sort((a, b) => a.precision - b.precision);
    }

    private checkAspects(planet1: string, pos1: number, planet2: string, pos2: number): AspectInfo[] {
        const aspects: AspectInfo[] = [];
        let angle = Math.abs(pos1 - pos2);
        if (angle > 180) angle = 360 - angle;
        
        for (const [aspectName, aspectData] of Object.entries(this.aspects)) {
            const orbitDiff = Math.abs(angle - aspectData.degree);
            if (orbitDiff <= aspectData.orbit) {
                aspects.push({
                    aspect: aspectName,
                    precision: orbitDiff,
                    planet1,
                    planet2,
                    angle: aspectData.degree
                });
            }
        }
        
        return aspects;
    }

    // Helper methods...
    private getDayOfYear(date: Date): number {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    private interpolateDailyPosition(pos1: number, pos2: number, date: Date): number {
        const timeOfDay = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
        return this.interpolateAngles(pos1, pos2, timeOfDay);
    }

    private isRetrogradePeriod(planet: string, day: number): boolean {
        // This should be replaced with actual retrograde period data for 2025
        // For now, returning a simplified version
        const retrogradePeriods: Record<string, number[][]> = {
            "Mercury": [[20, 40], [120, 140], [250, 270]],
            "Venus": [[180, 220]],
            "Mars": [[60, 90]],
            // Add other planets' retrograde periods...
        };
        
        const periods = retrogradePeriods[planet];
        if (!periods) return false;
        
        return periods.some(([start, end]) => day >= start && day <= end);
    }

    private getDailyMotion(planet: string): number {
        // Average daily motion for each planet
        const dailyMotion: Record<string, number> = {
            "Sun": 1.0,
            "Moon": 13.2,
            "Mercury": 1.3,
            "Venus": 1.2,
            "Mars": 0.5,
            "Jupiter": 0.083,
            "Saturn": 0.034,
            "Uranus": 0.012,
            "Neptune": 0.006,
            "Pluto": 0.004
        };
        return dailyMotion[planet] || 0;
    }

    private interpolateAngles(angle1: number, angle2: number, fraction: number): number {
        // Handle angle wrap-around for proper interpolation
        let diff = angle2 - angle1;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        return this.normalizeAngle(angle1 + diff * fraction);
    }

    private normalizeAngle(angle: number): number {
        return ((angle % 360) + 360) % 360;
    }
} 