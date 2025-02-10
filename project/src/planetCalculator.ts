import type { AspectData } from './settings'

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

    public calculatePositions(): PlanetData {
        const now = new Date();
        const dayOfYear = this.getDayOfYear(now);
        const result: PlanetData = {};
        
        for (const planet in this.dailyPositions2025) {
            const dailyData = this.dailyPositions2025[planet];
            const pos = this.interpolateDailyPosition(
                dailyData.positions[dayOfYear],
                dailyData.positions[dayOfYear + 1] || dailyData.positions[0],
                now
            );
            
            // Include retrograde information in the speed value
            const speed = dailyData.isRetrograde[dayOfYear] ? -1 : 1;
            result[planet] = [pos, speed];
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