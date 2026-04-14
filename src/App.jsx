import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Editor from './pages/dashboard/Editor'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path='editor' element={<Editor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
