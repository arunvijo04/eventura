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
    <nav
      className="bg-white px-4 py-3 md:px-6 md:py-4 flex flex-wrap justify-between items-center shadow-md"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <h1 className="text-xl md:text-2xl font-bold text-blue-600">Eventura</h1>

      <div className="flex items-center space-x-4 md:space-x-6">
        {!user ? (
          <>
            <Link
              to="/"
              className="text-base md:text-lg text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/admin"
              className="text-base md:text-lg text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
            >
              Admin
            </Link>
          </>
        ) : isAdminPage ? (
          <button
            onClick={handleLogout}
            className="text-base md:text-lg text-red-600 hover:text-blue-800 font-semibold transition duration-300"
          >
            Logout
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <img
              src={user.photoURL || "https://via.placeholder.com/40"} // Display user's profile image
              alt="User Profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <span
              onClick={handleUsernameClick} // Trigger navigation to Profile page
              className="text-base md:text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
            >
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-base md:text-lg text-red-600 hover:text-blue-800 font-semibold transition duration-300"
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
