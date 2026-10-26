import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Rythulu } from "./pages/Rythulu";
import { ThisMonthRythuluTable } from "./pages/ThisMonthRythuluTable";
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rythulu" element={<Rythulu />} />
        <Route   path="/this-month-rythulu"  element={<ThisMonthRythuluTable />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;