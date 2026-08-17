export type LinearFit = {
  slope: number
  intercept: number
  r2: number
}

export function linearRegression(points: { x: number; y: number }[]): LinearFit | null {
  const n = points.length
  if (n < 2) return null

  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  for (const point of points) {
    sumX += point.x
    sumY += point.y
    sumXY += point.x * point.y
    sumX2 += point.x * point.x
  }

  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return null

  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n

  const meanY = sumY / n
  let ssRes = 0
  let ssTot = 0
  for (const point of points) {
    const predicted = slope * point.x + intercept
    ssRes += (point.y - predicted) ** 2
    ssTot += (point.y - meanY) ** 2
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot

  return { slope, intercept, r2 }
}
