import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Editor from './pages/Editor'
import ImageManager from './components/ImageManager'

function App() {

  return (
    <BrowserRouter>
      <div className="layout">
            <aside className="sidebar">
                <Sidebar />
            </aside>

            <div className='content'>

              <Routes> 
                <Route index element={<Home />} />
                <Route path='/editor' element={<Editor />} />
                <Route path='/images' element={<ImageManager />} />
              </Routes>

            </div>
        </div>   
    </BrowserRouter>
  )
}

export default App
