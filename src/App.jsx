import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Rythulu } from "./pages/Rythulu";
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rythulu" element={<Rythulu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;