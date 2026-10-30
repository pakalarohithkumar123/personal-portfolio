
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";

import {
  startAutoLogout,
  stopAutoLogout
} from "./utils/autoLogout";

import "./index.css";

function App() {

  useEffect(() => {
    startAutoLogout();

    return () => {
      stopAutoLogout();
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
          </Route>

          <Route
            path="*"
            element={
              <section className="page-section">
                <h1>404 - Page Not Found</h1>
                <p>
                  The page you are looking for does not exist.
                </p>
              </section>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
