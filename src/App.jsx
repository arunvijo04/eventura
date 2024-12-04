import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Events from "./components/Events";
import AddEvent from "./components/AddEvent";
import EventDetails from "./components/EventDetails";
import Admin from "./components/Admin";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="p-6 bg-blue-500 text-white text-center">
          <h1 className="text-2xl font-bold">E-Management</h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
