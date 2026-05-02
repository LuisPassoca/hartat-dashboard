import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import Sidebar from './components/Sidebar'
import Editor from './pages/Editor'
import ImageManager from './components/ImageManager'
import Posts from './pages/Posts'

function App() {

  return (
    <BrowserRouter>
      <div className="layout">
            <aside className="sidebar">
                <Sidebar />
            </aside>

            <div className='content'>

              <Routes> 
                <Route index element={<Navigate to='/posts' replace />} />
                <Route path='/posts' element={<Posts />} />
                <Route path='/editor/:post?' element={<Editor />} />
                <Route path='/images' element={<ImageManager />} />
              </Routes>

            </div>
        </div>   
    </BrowserRouter>
  )
}

export default App
