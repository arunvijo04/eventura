import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../firebase";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold">{event.name}</h2>
      <p className="text-sm text-gray-500">
        {event.date} at {event.time}
      </p>
      <p className="mt-2 font-semibold">Location: {event.location}</p>
      <p className="mt-2">{event.description}</p>
    </div>
  );
};

export default EventDetails;
