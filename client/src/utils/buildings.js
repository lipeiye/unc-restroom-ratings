function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10
}

function getWeightedAverage(restrooms, key) {
  const totals = restrooms.reduce((acc, restroom) => {
    const weight = restroom.totalReviews || 0

    if (weight <= 0) {
      return acc
    }

    return {
      weightedSum: acc.weightedSum + restroom[key] * weight,
      totalWeight: acc.totalWeight + weight,
    }
  }, { weightedSum: 0, totalWeight: 0 })

  if (totals.totalWeight === 0) {
    return 0
  }

  return roundToOneDecimal(totals.weightedSum / totals.totalWeight)
}

export function getFloorSortValue(floor = '') {
  const normalized = floor.trim().toUpperCase()

  if (!normalized) {
    return Number.POSITIVE_INFINITY
  }

  const basementMatch = normalized.match(/^B(\d+)/)
  if (basementMatch) {
    return -Number(basementMatch[1])
  }

  if (normalized.startsWith('G')) {
    return 0
  }

  const numberedMatch = normalized.match(/^(\d+)/)
  if (numberedMatch) {
    return Number(numberedMatch[1])
  }

  return Number.POSITIVE_INFINITY
}

export function sortRestroomsByFloor(a, b) {
  const floorDiff = getFloorSortValue(a.floor) - getFloorSortValue(b.floor)

  if (floorDiff !== 0) {
    return floorDiff
  }

  return a.name.localeCompare(b.name)
}

export function buildBuildingPath(buildingName) {
  return `/building/${encodeURIComponent(buildingName)}`
}

export function groupRestroomsByBuilding(restrooms) {
  const grouped = restrooms.reduce((map, restroom) => {
    const current = map.get(restroom.building) || []
    current.push(restroom)
    map.set(restroom.building, current)
    return map
  }, new Map())

  return [...grouped.entries()]
    .map(([name, buildingRestrooms]) => {
      const sortedRestrooms = [...buildingRestrooms].sort(sortRestroomsByFloor)
      const floors = [...new Set(sortedRestrooms.map(restroom => restroom.floor))]
      const totalReviews = sortedRestrooms.reduce((sum, restroom) => sum + restroom.totalReviews, 0)
      const redAlertCount = sortedRestrooms.filter(restroom => restroom.redAlert).length
      const noFlushCount = sortedRestrooms.reduce((sum, restroom) => sum + restroom.noFlushCount, 0)

      return {
        name,
        floors,
        floorCount: floors.length,
        restroomCount: sortedRestrooms.length,
        totalReviews,
        averageRating: getWeightedAverage(sortedRestrooms, 'averageRating'),
        pooperScore: getWeightedAverage(sortedRestrooms, 'pooperScore'),
        cleanliness: getWeightedAverage(sortedRestrooms, 'cleanliness'),
        redAlertCount,
        noFlushCount,
        hasRedAlert: redAlertCount > 0,
        restrooms: sortedRestrooms,
      }
    })
    .sort((a, b) => {
      if (a.hasRedAlert !== b.hasRedAlert) {
        return Number(b.hasRedAlert) - Number(a.hasRedAlert)
      }

      if (a.averageRating !== b.averageRating) {
        return b.averageRating - a.averageRating
      }

      return a.name.localeCompare(b.name)
    })
}
