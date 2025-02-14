declare module '@astrodraw/astrochart' {
    export class Chart {
        constructor(elementId: string, width: number, height: number);
        radix(data: AstroData): void;
        transit(data: AstroData): void;
    }

    export class PlanetCalculator {
        constructor();
        calculatePositions(): PlanetData;
    }

    export interface AstroData {
        planets: PlanetData;
        cusps: number[];
    }

    export interface PlanetData {
        [key: string]: [number] | [number, number];
    }
} 