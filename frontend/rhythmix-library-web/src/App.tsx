import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard.tsx"

function App() {

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
