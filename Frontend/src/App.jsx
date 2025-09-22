import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacto from "./pages/Contacto";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <div className="w-[100vw]">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />}>
              Home
            </Route>
            <Route path="/login" element={<Login />}>
              Login
            </Route>
            <Route path="/registro" element={<Register />}>
              Registro
            </Route>
            <Route path="/Contacto" element={<Contacto />}>
              Contacto
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
