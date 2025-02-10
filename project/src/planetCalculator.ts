export interface PlanetPosition {
    position: number
    speed: number
}

export interface PlanetData {
    [key: string]: [number] | [number, number] // [position] or [position, speed]
}

export class PlanetCalculator {
    private lastUpdate: number;
    
    constructor() {
        this.lastUpdate = Date.now();
    }

    /**
     * Calculate current positions of planets
     * This is a placeholder - you would need to implement actual astronomical calculations
     * or connect to an ephemeris API
     */
    public calculatePositions(): PlanetData {
        const now = Date.now();
        const timeDiff = (now - this.lastUpdate) / 1000; // seconds
        this.lastUpdate = now;

        return {
            "Sun": [this.normalizeAngle(0 + timeDiff/240)],  // 1 rotation per day
            "Moon": [this.normalizeAngle(45 + timeDiff/20)], // ~13 rotations per day
            "Mercury": [this.normalizeAngle(120 + timeDiff/88)],
            "Venus": [this.normalizeAngle(180 + timeDiff/224)],
            "Mars": [this.normalizeAngle(210 + timeDiff/687)],
            "Jupiter": [this.normalizeAngle(240 + timeDiff/4380)],
            "Saturn": [this.normalizeAngle(280 + timeDiff/10767)],
            "Uranus": [this.normalizeAngle(300 + timeDiff/30660)],
            "Neptune": [this.normalizeAngle(320 + timeDiff/60225)],
            "Pluto": [this.normalizeAngle(340 + timeDiff/90560)]
        };
    }

    private normalizeAngle(angle: number): number {
        return angle % 360;
    }
} 