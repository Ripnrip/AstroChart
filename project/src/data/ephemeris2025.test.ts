import { getDayOfYear, getMonthAndDay, getPlanetPosition, ephemeris2025 } from './ephemeris2025'

describe('Ephemeris 2025', () => {
  describe('getDayOfYear', () => {
    test('should return correct day of year', () => {
      expect(getDayOfYear(new Date(2025, 0, 1))).toBe(1)  // January 1
      expect(getDayOfYear(new Date(2025, 0, 31))).toBe(31) // January 31
      expect(getDayOfYear(new Date(2025, 1, 1))).toBe(32)  // February 1
      expect(getDayOfYear(new Date(2025, 11, 31))).toBe(365) // December 31
    })
  })

  describe('getMonthAndDay', () => {
    test('should return correct month and day', () => {
      expect(getMonthAndDay(1)).toEqual([0, 0])   // January 1
      expect(getMonthAndDay(31)).toEqual([0, 30]) // January 31
      expect(getMonthAndDay(32)).toEqual([1, 0])  // February 1
      expect(getMonthAndDay(365)).toEqual([11, 30]) // December 31
    })
  })

  describe('getPlanetPosition', () => {
    test('should return correct position and retrograde status for Sun', () => {
      const [position, isRetrograde] = getPlanetPosition('Sun', new Date(2025, 0, 1))
      expect(position).toBe(280.5)
      expect(isRetrograde).toBe(false)
    })

    test('should return correct position and retrograde status for Mercury', () => {
      const [position, isRetrograde] = getPlanetPosition('Mercury', new Date(2025, 0, 1))
      expect(position).toBe(265.2)
      expect(isRetrograde).toBe(false)

      // Test during retrograde period
      const [pos2, retro2] = getPlanetPosition('Mercury', new Date(2025, 0, 15))
      expect(retro2).toBe(true)
    })

    test('should throw error for invalid date', () => {
      expect(() => {
        getPlanetPosition('Sun', new Date(2024, 0, 1))
      }).toThrow()
    })

    test('should throw error for invalid planet', () => {
      expect(() => {
        getPlanetPosition('InvalidPlanet', new Date(2025, 0, 1))
      }).toThrow()
    })
  })

  describe('ephemeris data structure', () => {
    test('should have correct structure for each planet', () => {
      for (const planet of Object.keys(ephemeris2025)) {
        expect(ephemeris2025[planet]).toHaveProperty('positions')
        expect(ephemeris2025[planet]).toHaveProperty('isRetrograde')
        expect(Array.isArray(ephemeris2025[planet].positions)).toBe(true)
        expect(Array.isArray(ephemeris2025[planet].isRetrograde)).toBe(true)
      }
    })

    test('should have 12 months of data for each planet', () => {
      for (const planet of Object.keys(ephemeris2025)) {
        expect(ephemeris2025[planet].positions.length).toBe(12)
        expect(ephemeris2025[planet].isRetrograde.length).toBe(12)
      }
    })

    test('should have correct number of days for each month', () => {
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      
      for (const planet of Object.keys(ephemeris2025)) {
        ephemeris2025[planet].positions.forEach((month, idx) => {
          expect(month.length).toBeLessThanOrEqual(daysInMonth[idx])
        })
      }
    })
  })
}) 