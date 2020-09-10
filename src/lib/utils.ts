import {earthRadiusKm} from './constants'

export type Coordinate = [number, number]

export type Extent = [number, number, number, number]

export function convertDegreesToRadians(degrees: number): number {
  if (Number.isNaN(Number(degrees)))
    throw new Error('parameter is not a number')
  return (degrees * Math.PI) / 180
}

/**
 *  Return distance between two coordinates in kilometers
 *  Haversine formula
 *  @Param firstCoordinate [lon, lat]
 *  @Param secondCoordinate [lon, lat]
 * */
export function getDistanceBetweenTwoCoordinates(
  firstCoordinate: Coordinate,
  secondCoordinate: Coordinate
): number {
  const deltaLat: number = convertDegreesToRadians(
    secondCoordinate[1] - firstCoordinate[1]
  )
  const deltaLon: number = convertDegreesToRadians(
    secondCoordinate[0] - firstCoordinate[0]
  )
  const firstLatitude = convertDegreesToRadians(firstCoordinate[1])
  const secondLatitude = convertDegreesToRadians(secondCoordinate[1])
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2) *
      Math.cos(firstLatitude) *
      Math.cos(secondLatitude)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}
