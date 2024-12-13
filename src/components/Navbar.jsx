import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth
import '@fontsource/poppins'; // Import Poppins font

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To check the current route

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isAdminPage = location.pathname === "/admin"; // Check if on /admin page

  const handleUsernameClick = () => {
    // Redirect to the profile page when the username is clicked
    navigate("/profile");
  };

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h1 className="text-2xl font-bold text-blue-600">Eventura</h1>

      {!user ? (
        <div className="space-x-6">
          <Link
            to="/"
            className="text-lg text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/admin"
            className="text-lg text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
          >
            Admin
          </Link>
        </div>
      ) : isAdminPage ? (
        // Show only Logout link on /admin page
        <button
          onClick={handleLogout}
          className="text-lg text-red-600 hover:text-blue-800 font-semibold transition duration-300"
        >
          Logout
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL || "https://via.placeholder.com/40"} // Display user's profile image
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            onClick={handleUsernameClick} // Trigger navigation to Profile page
            className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
          >
            {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-lg text-red-600 hover:text-blue-800 font-semibold transition duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
