import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {db} from "../firebase";

const Admin = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter((event) => event.id !== id));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="p-6 bg-white rounded shadow-md">
            <h3 className="text-lg font-bold">{event.name}</h3>
            <p className="text-sm text-gray-500">
              {event.date} at {event.time}
            </p>
            <button
              onClick={() => handleDelete(event.id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Delete Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
