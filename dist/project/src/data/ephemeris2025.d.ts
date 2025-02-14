export interface PlanetaryData {
    positions: number[][];
    isRetrograde: boolean[][];
}
export interface Ephemeris {
    [key: string]: PlanetaryData;
}
export declare const ephemeris2025: Ephemeris;
export declare function getDayOfYear(date: Date): number;
export declare function getMonthAndDay(dayOfYear: number): [number, number];
export declare function getPlanetPosition(planet: string, date: Date): [number, boolean];
