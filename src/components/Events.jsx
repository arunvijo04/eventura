import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {db} from "../firebase";
import { Link } from "react-router-dom";

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
    <div>
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="p-6 bg-white rounded shadow-md hover:shadow-lg"
          >
            <h3 className="text-lg font-bold">{event.name}</h3>
            <p className="text-sm text-gray-500">
              {event.date} at {event.time}
            </p>
            <p className="mt-2">{event.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Events;
