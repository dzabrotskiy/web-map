import React from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import css from './index.css'
import {fromLonLat} from 'ol/proj'
import {Zoom} from './components/zoom'
import {SearchPanel} from './components/SearchPanel'

export const App = (): JSX.Element => {
  const [map, setMap] = React.useState<Map | null>(null)
  React.useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: fromLonLat([37.6178, 55.7517]),
        zoom: 11,
      }),
      controls: [],
    })
    setMap(map)
  }, [])
  return (
    <div id="map" className={css.Map}>
      {map && (
        <>
          <Zoom map={map} />
          <SearchPanel map={map} />
        </>
      )}
    </div>
  )
}
