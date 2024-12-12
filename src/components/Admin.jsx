import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Admin = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map(doc => doc.data());
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin - Registered Users</h1>
      {events.map(event => (
        <div key={event.name} className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl">{event.name}</h2>
          <ul>
            {Object.entries(event.participantsList || {}).map(([uid, name]) => (
              <li key={uid}>{name} (ID: {uid})</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Admin;
