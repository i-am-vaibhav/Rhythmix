import { Route, Routes } from 'react-router-dom'
import './App.css'
import MusicPlayer from './components/MusicPlayer.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'

const App: React.FC = () => {
  
  return (
  <>
    <Routes>
    <Route path="/music" element={<MusicPlayer />} />
    </Routes>
  </>
  );
};

export default App
