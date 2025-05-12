import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard.tsx"
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'

function App() {

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
