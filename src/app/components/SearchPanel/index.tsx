import React, {ReactNode, Component} from 'react'
import Map from 'ol/Map'
import css from './index.css'
import {fetchMarkers} from '../../../api'
import {fromLonLat} from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import {Cluster, Vector as VectorSource} from 'ol/source'
import {Vector as VectorLayer} from 'ol/layer'
import {
  Icon,
  Style
} from 'ol/style';

interface SearchPanelProps {
  map: Map
}

interface SearchPanelState {
  value: string,
  layer: VectorLayer | null
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

  private lastQueryString: string = ''

  constructor(props: SearchPanelProps) {
    super(props)
    this.state = {
      value: '',
      layer: null
    }
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: {value},
    } = event
    if (value.length === 0 && this.state.layer) {
      this.props.map.removeLayer(this.state.layer)
      this.setState({
        layer: null
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
      alert('Маркеры по этому запросу уже отображены')
      return
    }
    if (this.lastQueryString !== value && layer)
      this.props.map.removeLayer(layer)
    if (value) {
      this.lastQueryString = value
      const {result: {items, total}} = await fetchMarkers(value)
      console.log('items: ', items)
      console.log('total: ', total)
      let features = new Array(items.length)
      items.forEach((item: Item, index: number) => {
        if (item.lat && item.lon) {
          const coordinate = fromLonLat([item.lon, item.lat])
          features[index] = new Feature(new Point(coordinate))
        }
      })
      const source = new VectorSource({
        features: features,
      })
      const clusterSource = new Cluster({
        distance: 10,
        source: source,
      })
      const cluster = new VectorLayer({
        source: clusterSource,
        style: new Style({
          image: new Icon({
            src: '/static/2GisMarker.png',
            scale: 0.2
          }),
        })
      })
      this.props.map.addLayer(cluster)
      this.setState({
        layer: cluster
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
