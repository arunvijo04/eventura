import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="text-blue-500 bg-white px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-bold">EventApp</h1>

      {!user ? (
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Login
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        </div>
      ) : user.email === "admin@example.com" ? ( // Replace with actual admin email
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span>{user.displayName || user.email}</span>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
