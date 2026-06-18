import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import Sidebar from './components/Sidebar'
import Editor from './pages/Editor'
import ImageManager from './components/ImageManager'
import Posts from './pages/Posts'
import PostReader from './pages/PostReader'
import Images from './pages/Images'
import BlogEditor from './editors/BlogEditor'

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
                <Route path='/posts/:post' element={<PostReader />} />
                <Route path='/editor/:post?' element={<Editor />} />
                <Route path='/images' element={<Images />} />
                <Route path='/blog' element={<BlogEditor />} />
                <Route path='*' element={ <> <h1> Erro 404: </h1> <h2> Página não encontrada. </h2> </> } />
              </Routes>

            </div>
        </div>   
    </BrowserRouter>
  )
}

export default App
