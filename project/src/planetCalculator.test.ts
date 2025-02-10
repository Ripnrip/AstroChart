import { PlanetCalculator } from './planetCalculator';

describe('PlanetCalculator', () => {
    let calculator: PlanetCalculator;

    beforeEach(() => {
        calculator = new PlanetCalculator();
    });

    test('should calculate positions for all planets', () => {
        const positions = calculator.calculatePositions();
        const expectedPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
                               'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
        
        expect(Object.keys(positions)).toEqual(expectedPlanets);
        
        // Check that each planet has valid position and speed
        for (const planet in positions) {
            const [position, speed] = positions[planet];
            expect(position).toBeGreaterThanOrEqual(0);
            expect(position).toBeLessThan(360);
            if (speed !== undefined) {
                expect(Math.abs(speed)).toBe(1); // Should be either 1 or -1
            }
        }
    });

    test('should calculate aspects between planets', () => {
        const aspects = calculator.calculateAspects();
        expect(Array.isArray(aspects)).toBe(true);
        
        if (aspects.length > 0) {
            const aspect = aspects[0];
            expect(aspect).toHaveProperty('aspect');
            expect(aspect).toHaveProperty('precision');
            expect(aspect).toHaveProperty('planet1');
            expect(aspect).toHaveProperty('planet2');
            expect(aspect).toHaveProperty('angle');
        }
    });
}); 