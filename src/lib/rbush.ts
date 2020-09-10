import RBush_, {BBox} from 'rbush'
import {Coordinate, Extent} from './utils'

export interface Entry {
  minX: number
  minY: number
  maxX: number
  maxY: number
  [key: string]: any
}

interface IRBush {
  insert(extent: Extent, value: Entry): void
  getInExtent(extent: Extent): Array<Coordinate>
}

export class RBush implements IRBush {
  private rbush: RBush_<Entry>
  public constructor(maxEntries: number) {
    this.rbush = new RBush_(maxEntries)
  }

  public insert(extent: Extent, value?: Entry) {
    const item: Entry = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
    }
    if (value) item[`${value}`] = value
    this.rbush.insert(item)
  }

  public getInExtent(extent: Extent): Array<Coordinate> {
    const bbox: BBox = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
    }
    const items = this.rbush.search(bbox)
    return items.map((item: Entry) => {
      return [item.maxX, item.maxY]
    })
  }
}
