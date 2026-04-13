import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import Post from './pages/dashboard/Post'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="post" element={<Post />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
