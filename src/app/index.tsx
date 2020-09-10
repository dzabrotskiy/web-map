import React from 'react'
import css from './index.css'
import {load} from '@2gis/mapgl'
import * as MapGl from '@2gis/mapgl/types'
import {SearchPanel, SearchPanelProps} from './components/search-panel'

export const App: React.FC = (): JSX.Element => {
  const [mapGl, setMapGl] = React.useState<SearchPanelProps>({
    map: null,
    mapgl: null,
  })
  React.useEffect(() => {
    let map: MapGl.Map
    load().then((mapgl: typeof MapGl) => {
      map = new mapgl.Map('map', {
        center: [37.6178, 55.7517],
        zoom: 11,
        key: '6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb',
      })
      setMapGl({
        map,
        mapgl,
      })
    })
    return () => map && map.destroy()
  }, [])
  return (
    <div id="map" className={css.Map}>
      {mapGl.map && <SearchPanel {...mapGl} />}
    </div>
  )
}
