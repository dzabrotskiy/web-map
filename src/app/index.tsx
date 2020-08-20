import React from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
// import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import css from './index.css'
import {fromLonLat} from 'ol/proj'
import {Zoom} from './components/zoom'
import {SearchPanel} from './components/SearchPanel'
import XYZSource from 'ol/source/XYZ'

export const App = (): JSX.Element => {
  const [map, setMap] = React.useState<Map | null>(null)
  React.useEffect(() => {
    const layer2GIS = new TileLayer({
      source: new XYZSource({
        url: 'http://tile1.maps.2gis.com/tiles?layerType=nc&x={x}&y={y}&z={z}',
        crossOrigin: 'anonymous'
      })
    })
    const map = new Map({
      layers: [layer2GIS],
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
