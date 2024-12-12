import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase methods

const Navbar = ({ user }) => {
  const navigate = useNavigate(); // For navigation after logout

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      navigate("/"); // Navigate to the login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
      <h1 className="font-bold">
        <Link to="/">E-Management</Link>
      </h1>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/events" className="hover:underline">Events</Link>

        {/* Show Admin link if the user is logged in */}
        {user && (
          <>
            <Link to="/add-event" className="hover:underline">Add Event</Link>
            <Link to="/admin" className="hover:underline">Admin</Link>
          </>
        )}

        {/* Show Login link if no user is logged in */}
        {!user ? (
          <Link to="/login" className="hover:underline">Login</Link>
        ) : (
          <div className="flex items-center space-x-2">
            {/* Show user name and photo if available */}
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-semibold">{user.displayName || user.email}</span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
