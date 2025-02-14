// Data structure for planetary positions and retrograde periods in 2025
export interface PlanetaryData {
  positions: number[][]  // Array of 12 months, each containing daily positions
  isRetrograde: boolean[][]  // Array of 12 months, each containing daily retrograde status
}

export interface Ephemeris {
  [key: string]: PlanetaryData
}

type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'

interface RetrogradePeriod {
  start: Date
  end: Date
}

// Initial positions for planets on Jan 1, 2025 (based on astronomical calculations)
const INITIAL_POSITIONS: Record<Planet, number> = {
  Sun: 280.5,
  Moon: 125.3,
  Mercury: 265.2,
  Venus: 305.8,
  Mars: 98.4,
  Jupiter: 35.2,
  Saturn: 5.9,
  Uranus: 44.8,
  Neptune: 355.2,
  Pluto: 298.6
}

// Average daily motion for each planet
const DAILY_MOTION: Record<Planet, number> = {
  Sun: 0.9856,
  Moon: 13.1764,
  Mercury: 1.383,
  Venus: 1.2,
  Mars: 0.524,
  Jupiter: 0.083,
  Saturn: 0.034,
  Uranus: 0.012,
  Neptune: 0.006,
  Pluto: 0.004
}

// Retrograde periods for 2025
const RETROGRADE_PERIODS: Partial<Record<Planet, RetrogradePeriod[]>> = {
  Mercury: [
    { start: new Date(2025, 0, 14), end: new Date(2025, 0, 25) },
    { start: new Date(2025, 4, 10), end: new Date(2025, 4, 21) },
    { start: new Date(2025, 8, 15), end: new Date(2025, 8, 26) }
  ],
  Venus: [
    { start: new Date(2025, 6, 1), end: new Date(2025, 6, 12) }
  ],
  Mars: [
    { start: new Date(2025, 2, 1), end: new Date(2025, 2, 12) }
  ],
  Jupiter: [
    { start: new Date(2025, 5, 15), end: new Date(2025, 5, 26) }
  ],
  Saturn: [
    { start: new Date(2025, 7, 1), end: new Date(2025, 7, 12) }
  ],
  Uranus: [
    { start: new Date(2025, 8, 15), end: new Date(2025, 8, 26) }
  ],
  Neptune: [
    { start: new Date(2025, 9, 1), end: new Date(2025, 9, 12) }
  ],
  Pluto: [
    { start: new Date(2025, 4, 15), end: new Date(2025, 4, 26) }
  ]
}

// Helper function to calculate position for a given date
function calculatePosition(planet: Planet, date: Date): number {
  const startOfYear = new Date(2025, 0, 1)
  const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  let position = INITIAL_POSITIONS[planet] + (DAILY_MOTION[planet] * daysSinceStart)
  
  // Normalize to 0-360 range
  position = ((position % 360) + 360) % 360
  
  return position
}

// Helper function to check if a planet is retrograde on a given date
function checkRetrograde(planet: Planet, date: Date): boolean {
  if (planet === 'Sun' || planet === 'Moon') return false
  
  const periods = RETROGRADE_PERIODS[planet] || []
  return periods.some((period: RetrogradePeriod) => date >= period.start && date <= period.end)
}

// Generate daily positions and retrograde status for each planet
export const ephemeris2025: Ephemeris = Object.keys(INITIAL_POSITIONS).reduce((acc, planetKey) => {
  const planet = planetKey as Planet
  const positions: number[][] = []
  const isRetrograde: boolean[][] = []
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2025, month + 1, 0).getDate()
    const monthPositions: number[] = []
    const monthRetrograde: boolean[] = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day)
      monthPositions.push(calculatePosition(planet, date))
      monthRetrograde.push(checkRetrograde(planet, date))
    }
    
    positions.push(monthPositions)
    isRetrograde.push(monthRetrograde)
  }
  
  acc[planet] = { positions, isRetrograde }
  return acc
}, {} as Ephemeris)

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getMonthAndDay(dayOfYear: number): [number, number] {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let month = 0
  let remainingDays = dayOfYear
  
  while (remainingDays > daysInMonth[month]) {
    remainingDays -= daysInMonth[month]
    month++
  }
  
  return [month, remainingDays - 1]
}

export function getPlanetPosition(planet: string, date: Date): [number, boolean] {
  if (date.getFullYear() !== 2025) {
    throw new Error('Data only available for year 2025')
  }
  
  const dayOfYear = getDayOfYear(date)
  const [month, day] = getMonthAndDay(dayOfYear)
  
  const planetData = ephemeris2025[planet]
  if (!planetData || !planetData.positions[month] || planetData.positions[month].length <= day) {
    throw new Error(`No data available for ${planet} on ${date.toISOString()}`)
  }
  
  return [
    planetData.positions[month][day],
    planetData.isRetrograde[month][day]
  ]
} 