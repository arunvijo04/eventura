import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Welcome to E-Management!</h2>
      <div className="flex justify-center space-x-4">
        <Link
          to="/events"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          View Events
        </Link>
        <Link
          to="/add-event"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Add Event
        </Link>
        <Link
          to="/admin"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default Home;
