import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/RegisterForm';
import "./App.css"

function App() {
  return (
    <React.Fragment>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/signup" element={<SignupForm/>} />
            <Route render={() => <main><h1 className="text-center">Page not found</h1></main>} />
          </Routes>
        </Router>
    </React.Fragment>
  );
}
export default App;
