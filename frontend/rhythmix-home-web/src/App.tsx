import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path='/dashboard' element={ <Dashboard></Dashboard> } ></Route>
      </Routes>
    </>
  )
}

export default App;
