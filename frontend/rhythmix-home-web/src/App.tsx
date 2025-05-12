import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard';
import trackList from 'container/MockedMusic';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const App: React.FC = () => {
  return (
      <Routes>
        <Route path='/dashboard' element={
            <>
              <Dashboard queue={trackList}></Dashboard>
            </> 
          } >
        </Route>
      </Routes>
  )
}

export default App;
