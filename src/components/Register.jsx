import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import bgImage from "../assets/bg.jpg"; // Background image

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        photoURL: profilePic || "",
      });

      // Store user info in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName: userCredential.user.displayName || "",
        photoURL: profilePic || "",
        events: [],
      });

      navigate("/events");
    } catch (error) {
      setError("Error creating account. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white p-6 md:p-8 lg:p-10 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Profile Picture URL (Optional)</label>
            <input
              type="text"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
