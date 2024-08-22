import { Feedback } from "./Pages/Feedback"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Queue } from "./Pages/Queue"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/queue" element={<Feedback />} />
        <Route path="/" element={<Queue/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
