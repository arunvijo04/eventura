import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg.jpg";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-gray-900 bg-opacity-80"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group relative p-6 bg-white bg-opacity-90 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={event.imageLink || "https://via.placeholder.com/400"} // Fallback image if no event image
                  alt={event.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-800">{event.location}</p>
                <p className="text-sm text-gray-600 mt-2 truncate">{event.description}</p>
              </div>
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
