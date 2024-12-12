import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import Firebase auth
import Events from "./components/Events";
import EventDetails from "./components/EventDetails";
import Admin from "./components/Admin"; // Import Admin component
import Login from "./components/Login"; // Import Login component
import Navbar from "./components/Navbar"; // Import Navbar component

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state based on auth state
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Pass user to Navbar */}
        <Navbar user={user} />

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/admin" element={<Admin />} /> {/* Admin route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
