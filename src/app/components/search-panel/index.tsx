import React, {ReactNode, Component} from 'react'
import css from './index.css'
import {fetchMarkers} from 'api'
import * as MapGl from '@2gis/mapgl/types'
import {Cluster} from 'lib'

export interface SearchPanelProps {
  map: MapGl.Map | null
  mapgl: typeof MapGl | null
}

interface SearchPanelState {
  value: string
  layer: Cluster | null
}

interface Item {
  geometry_id: string
  id: string
  is_advertising: boolean
  lat: number
  lon: number
  match_type: number
  source_type: number
  type: string
}

export class SearchPanel extends Component<SearchPanelProps, SearchPanelState> {
  private lastQueryString = ''

  constructor(props: SearchPanelProps) {
    super(props)
    this.state = {
      value: '',
      layer: null,
    }
  }

  private onInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const {
      target: {value},
    } = event
    if (value.length === 0 && this.state.layer) {
      this.state.layer.destroy()
      this.setState({
        layer: null,
      })
      this.lastQueryString = ''
    }
    this.setState({
      value,
    })
  }

  private onInputKeyDown = async (
    event: React.KeyboardEvent
  ): Promise<void> => {
    const {key} = event
    if (key === 'Enter') {
      await this.fetchMarkers()
    }
  }

  private fetchMarkers = async (): Promise<void> => {
    const {value, layer} = this.state
    const {mapgl, map} = this.props
    if (!mapgl || !map) return
    if (this.lastQueryString === value) {
      alert(`Маркеры по запросу ${this.lastQueryString} уже отображены`)
      return
    }
    if (this.lastQueryString !== value && layer) layer.destroy()
    if (value) {
      this.lastQueryString = value
      const {
        result: {items},
      } = await fetchMarkers(value)
      const coordinates: Array<[number, number]> = items.map((item: Item) => [
        item.lon,
        item.lat,
      ])
      const cluster: Cluster = new Cluster(map, {
        coordinates,
        mapgl,
      })
      console.log(cluster)
      this.setState({
        layer: cluster,
      })
    }
  }

  public render(): ReactNode {
    return (
      <div className={css.Container}>
        <input
          className={css.Input}
          type="text"
          onChange={this.onInputChange}
          onKeyDown={this.onInputKeyDown}
        />
        <button className={css.Button} onClick={this.fetchMarkers}>
          <img src="/static/magnifier.png" alt="OK" />
        </button>
      </div>
    )
  }
}
