import React, {ReactNode, Component} from 'react'
import css from './index.css'
import {fetchMarkers} from '../../../api'
import {Clusterer} from '@2gis/mapgl-clusterer'

interface SearchPanelProps {
  map: any
}

interface SearchPanelState {
  value: string
  layer: any
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

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
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

  onInputKeyDown = async (event: React.KeyboardEvent): Promise<void> => {
    const {key} = event
    if (key === 'Enter') {
      await this.fetchMarkers()
    }
  }

  fetchMarkers = async (): Promise<void> => {
    const {value, layer} = this.state
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
      const clusterer = new Clusterer(this.props.map, {
        radius: 50,
      })
      const markers = items.map((item: Item) => ({
        coordinates: [item.lon, item.lat],
      }))
      clusterer.load(markers)
      this.setState({
        layer: clusterer,
      })
    }
  }

  render(): ReactNode {
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
