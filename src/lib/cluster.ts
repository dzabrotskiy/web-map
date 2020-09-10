import * as MapGl from '@2gis/mapgl/types'
// import {zoomOptions} from './constants'
import {Coordinate, Extent} from './utils'
import {RBush} from './rbush'
// import {getDistanceBetweenTwoCoordinates, Coordinate} from './utils'

interface ClusterOptions {
  readonly coordinates: Array<[number, number]>
  readonly mapgl: typeof MapGl
}

interface ICluster {
  destroy(): void
}

export class Cluster implements ICluster {
  private readonly map: MapGl.Map
  private readonly coordinates: Array<[number, number]>
  private readonly mapgl: typeof MapGl
  private markers: Array<MapGl.Marker> = []
  private rtree: RBush

  public constructor(map: MapGl.Map, options: ClusterOptions) {
    if (!map) throw new Error('Map is not defined')
    if (!options || !options.mapgl || !options.coordinates)
      throw new Error('Options is not defined')
    this.map = map
    this.coordinates = options.coordinates
    this.mapgl = options.mapgl
    this.rtree = new RBush(this.coordinates.length)
    console.log(map.getBounds())
    this.init()
  }

  private init(): void {
    for (const coord of this.coordinates)
      this.rtree.insert([coord[0], coord[1], coord[0], coord[1]])
    this.clusterize()
    this.renderMarkers()
    // this.map.on('zoom', () => {
    //   if (this.currentZoom !== Math.floor(this.map.getZoom())) {
    //     this.currentZoom = Math.floor(this.map.getZoom())
    //     console.log('this.currentZoom: ', this.currentZoom)
    //     this.destroy()
    //     this.renderMarkers()
    //   }
    // })
  }

  private renderMarkers(): void {
    // console.log('for zoom: ', this.currentZoom, ' this.tree[this.currentZoom]: ', this.tree[this.currentZoom])
    // this.tree[this.currentZoom].forEach(coord => {
    //   const marker = new this.mapgl.Marker(this.map, {
    //     coordinates: coord
    //   })
    //   this.markers.push(marker)
    // })
    this.coordinates.forEach((coord) => {
      const marker = new this.mapgl.Marker(this.map, {
        coordinates: coord,
      })
      // console.log(marker)
      this.markers.push(marker)
    })
  }

  private clusterize() {
    const extent: Extent = [Infinity, Infinity, -Infinity, -Infinity]
    const distance = 0
    const clustered: {[key: string]: boolean} = {}
    console.log('RTREE: ', this.rtree)
    this.coordinates.forEach((coord: Coordinate) => {
      if (!(`${[coord[0], coord[1], coord[0], coord[1]]}` in clustered)) {
        const x = coord[0]
        const y = coord[1]
        extent[0] = x
        extent[1] = y
        extent[2] = x
        extent[3] = y
        extent[0] = extent[0] - distance
        extent[1] = extent[1] - distance
        extent[2] = extent[2] - distance
        extent[3] = extent[3] - distance
        let neighbors = this.rtree.getInExtent(extent)
        neighbors = neighbors.filter((neighbor) => {
          if (!(`${neighbor}` in clustered)) {
            clustered[`${neighbor}`] = true
            return true
          } else {
            return false
          }
        })
        console.log(neighbors)
        const centroid: Coordinate = [0, 0]
        neighbors.forEach((coord: Coordinate) => {
          centroid[0] += +coord[0]
          centroid[1] += +coord[1]
        })
        centroid[0] *= 1 / neighbors.length
        centroid[1] *= 1 / neighbors.length
        console.log('CENTROID: ', centroid)
      }
    })
  }

  public destroy(): void {
    for (const marker of this.markers) marker.destroy()
    this.markers = []
  }
}
