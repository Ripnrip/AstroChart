export interface PlanetPosition {
    position: number;
    speed: number;
    isRetrograde?: boolean;
}
export interface PlanetData {
    [key: string]: [number] | [number, number];
}
export interface AspectInfo {
    aspect: string;
    precision: number;
    planet1: string;
    planet2: string;
    angle: number;
}
export declare class PlanetCalculator {
    private lastUpdate;
    private dailyPositions2025;
    private aspects;
    constructor();
    private initializeDailyPositions;
    private loadDailyPositions;
    private getStartPosition;
    calculatePositions(): PlanetData;
    calculateAspects(): AspectInfo[];
    private checkAspects;
    private getDayOfYear;
    private interpolateDailyPosition;
    private isRetrogradePeriod;
    private getDailyMotion;
    private interpolateAngles;
    private normalizeAngle;
}
