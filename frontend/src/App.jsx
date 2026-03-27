import { Routes, Route } from "react-router-dom";
import Navbar from "./landing_page/Navbar";
import Home from "./landing_page/home/Home";
import FeaturesPage from "./landing_page/feature/FeaturesPage";
import About from "./landing_page/about/About";
import Footer from "./landing_page/Footer";
import Events from "./landing_page/Events";  // ✅ add this
import Signup from "./landing_page/signup/Signup";
import Login from "./landing_page/signup/Login"


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;   // ✅ THIS LINE WAS MISSING