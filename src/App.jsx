import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import Sidebar from './components/Sidebar'
import Images from './pages/Images'
import Index from './pages/Index'
import Editor from './pages/Editor'

function App() {

  return (
    <BrowserRouter>
      <div className="layout">
            <aside className="sidebar">
                <Sidebar />
            </aside>

            <div className='content'>

              <Routes> 
                <Route index element={<Index />} />
                <Route path='/editor/*' element={<Editor />} />
                <Route path='/images' element={<Images />} />
                <Route path='*' element={ <> <h1> Erro 404: </h1> <h2> Página não encontrada. </h2> </> } />
              </Routes>

            </div>
        </div>   
    </BrowserRouter>
  )
}

export default App
