import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "../src/screens/Registerscreen";
import Loginrscreen from "../src/screens/Loginscreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="home" element={<Homescreen />} exact />
          <Route
            path="/book/:roomId/:fromDate/:toDate"
            element={<Bookingscreen />}
            exact
          />
          <Route path="/register" element={<Registerscreen />} exact />
          <Route path="/login" element={<Loginrscreen />} exact />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
