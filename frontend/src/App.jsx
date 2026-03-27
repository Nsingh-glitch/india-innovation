import { Routes, Route ,useLocation} from "react-router-dom";
import Navbar from "./landing_page/Navbar";
import Home from "./landing_page/home/Home";
import FeaturesPage from "./landing_page/feature/FeaturesPage";
import About from "./landing_page/about/About";
import Footer from "./landing_page/Footer";
import Events from "./landing_page/Events";  
import Signup from "./landing_page/signup/Signup";
import Login from "./landing_page/signup/Login"
import Grievance from "./landing_page/report/Grievance";
import Dashboard from "./landing_page/dashboard/Dashboard";
import NewsPage from "./landing_page/news/NewsPage";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/grievance" element={<Grievance />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;   