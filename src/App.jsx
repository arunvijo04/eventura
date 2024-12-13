import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Events from "./components/Events";
import EventDetails from "./components/EventDetails";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ParticipantDetails from './components/ParticipantDetails';
import Profile from './components/Profile'; 
import SignUp from "./components/Signup";// Add Profile route
import '@fontsource/poppins';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:id" element={<ParticipantDetails />} />
            <Route path="/profile" element={<Profile />} /> {/* Added Profile Route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
