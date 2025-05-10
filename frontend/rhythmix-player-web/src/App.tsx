import { Route, Routes } from 'react-router-dom'
import './App.css'
import MusicPlayer from './components/MusicPlayer.tsx'
import FooterMusicPlayer from './components/FooterMusicPlayer/FooterMusicPlayer.tsx'
import { mockQueue, type SongMetadata } from './music/model.ts';
import { useState } from 'react';


function App() {

  const [queue, setQueue] = useState<SongMetadata[]>(mockQueue);

  const handleQueueChange = (newQueue: SongMetadata[]) => {
    setQueue(newQueue);
  };

  return (
    <>
    <Routes>
      <Route path="/footer" element={<FooterMusicPlayer musicPlayerNavigationUrl='/music' queue={queue} setQueue={handleQueueChange}/>} />
      <Route path="/music" element={<MusicPlayer queue={queue} onQueueChange={handleQueueChange}/>} />
    </Routes>
    </>
  )
}

export default App
