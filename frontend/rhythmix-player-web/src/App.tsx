import { Route, Routes } from 'react-router-dom'
import './App.css'
import MusicPlayer from './components/MusicPlayer'
import FooterMusicPlayer from './components/FooterMusicPlayer'

function App() {

  return (
    <>
    <Routes>
      <Route path="/footer" element={<FooterMusicPlayer/>} />
      <Route path="/music" element={<MusicPlayer/>} />
    </Routes>
    </>
  )
}

export default App
