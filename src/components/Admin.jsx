import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Use Link to navigate to event details
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import bgImage from "../assets/bg.jpg";
import EventForm from "./EventForm";  // Import the EventForm component

const Admin = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-gray-900 bg-opacity-80 text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin - Manage Events</h1>

        {/* Event Form Section */}
        <div className="mb-8">
          <EventForm />
        </div>

        {/* Event List Section */}
        {events.length === 0 ? (
          <p className="text-lg text-center">No events available</p>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="mt-6 p-6 bg-white text-black rounded shadow-md cursor-pointer"
            >
              <Link to={`/admin/${event.id}`} className="text-xl font-bold">
                {event.name}
              </Link>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}
              </p>
              <p className="mt-4 text-lg">
                <strong>Participants Count:</strong> {event.participants}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
