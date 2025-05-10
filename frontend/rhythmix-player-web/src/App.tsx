import { Route, Routes } from 'react-router-dom'
import './App.css'
import MusicPlayer from './components/MusicPlayer.tsx'
import FooterMusicPlayer from './components/FooterMusicPlayer/FooterMusicPlayer.tsx'

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
