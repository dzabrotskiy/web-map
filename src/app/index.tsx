import React from 'react'
import css from './index.css'
import {load} from '@2gis/mapgl'
import {SearchPanel} from './components/search-panel'

export const App = (): JSX.Element => {
  const [map, setMap] = React.useState<any>(null)
  React.useEffect(() => {
    let map
    load().then((mapglApi) => {
      map = new mapglApi.Map('map', {
        center: [37.6178, 55.7517],
        zoom: 11,
        key: '6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb',
      })
      setMap(map)
    })
  }, [])
  return (
    <div id="map" className={css.Map}>
      {map && <SearchPanel map={map} />}
    </div>
  )
}
