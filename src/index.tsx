import React from 'react'
import {render} from 'react-dom'
import './index.css'
import {App} from './app'

const rootElement: HTMLElement | null = document.getElementById('root')

render(<App />, rootElement)
