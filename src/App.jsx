import { Feedback } from "./Pages/Feedback"
import { BrowserRouter, Routes, Route } from "react-router-dom"
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
