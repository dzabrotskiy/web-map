import React from 'react'
import css from './index.css'
import Map from 'ol/Map'

interface ZoomProps {
  map: Map
}

export const Zoom = (props: ZoomProps): JSX.Element => {
  const {map} = props
  const view = map.getView()
  const [zoom, setZoom] = React.useState<number>(view.getZoom())
  React.useEffect(() => {
    view.on('change:resolution', () => {
      setZoom(view.getZoom())
    })
  }, [view])
  const increaseZoom = (): void => {
    changeZoom(zoom + 1)
  }
  const decreaseZoom = (): void => {
    zoom > 0 && changeZoom(zoom - 1)
  }
  const changeZoom = (zoom: number): void => {
    map.getView().animate({zoom, duration: 100})
    setZoom(zoom)
  }
  return (
    <div className={css.Container}>
      <button className={css.Button} onClick={increaseZoom}>
        +
      </button>
      <div className={css.Line} />
      <button className={css.Button} onClick={decreaseZoom}>
        -
      </button>
    </div>
  )
}
