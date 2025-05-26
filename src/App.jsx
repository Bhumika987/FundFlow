import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Campaign from './pages/Campaign'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/campaign/:id" element={<Campaign />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Catch 404s */}
      </Routes>
    </>
  )
}