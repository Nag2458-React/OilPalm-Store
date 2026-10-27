import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Rythulu } from "./pages/Rythulu";
import { ThisMonthRythuluTable } from "./pages/ThisMonthRythuluTable";
import { ThisMonthPurchasedRythulu } from "./pages/ThisMonthPurchasedRythulu";
import { ThisMonthTotalEarnings } from "./pages/ThisMonthTotalEarnings";
import { OverallTotalEarnings } from "./pages/OverallTotalEarnings";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rythulu" element={<Rythulu />} />
        <Route   path="/this-month-rythulu"  element={<ThisMonthRythuluTable />}   />
         <Route  path="/this-month-purchased-rythulu"  element={<ThisMonthPurchasedRythulu />}  />
         <Route  path="/this-month-total-earnings"  element={<ThisMonthTotalEarnings />} />
         <Route  path="/overall-total-earnings"  element={<OverallTotalEarnings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;