import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Homepage from './screen/homepage'
import dashboard from './screen'
import chat from ''
import footer from './components'
import Maincontent from './screen'

function App = () => {
  return (
    <div class="min-h-screen flex flex-col">
      <Homepage />
      <Service />
      <About Us />
      <Catlog Upload />
      <Chat />
    </div>
  )
}

export default App