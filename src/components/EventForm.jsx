import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import {db} from "../firebase";

const EventForm = () => {
  const [event, setEvent] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), event);
      alert("Event added successfully!");
      setEvent({ name: "", date: "", time: "", location: "", description: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form className="p-6 bg-gray-100 rounded shadow-md" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-bold">Event Name</label>
        <input
          type="text"
          name="name"
          value={event.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Date</label>
        <input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Time</label>
        <input
          type="time"
          name="time"
          value={event.time}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Location</label>
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Description</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
