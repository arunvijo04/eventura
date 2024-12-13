import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const EventForm = () => {
  const [event, setEvent] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    imageLink: "",
    participants: "",
    organizer: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate fields
      if (
        !event.name ||
        !event.date ||
        !event.time ||
        !event.location ||
        !event.description ||
        !event.participants ||
        !event.organizer
      ) {
        alert("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      // Add document to Firestore
      await addDoc(collection(db, "events"), {
        ...event,
        participants: parseInt(event.participants, 10), // Ensure numeric value
        participantsList: {}, // Initialize empty participant list
      });
      alert("Event added successfully!");
      setEvent({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
        imageLink: "",
        participants: "",
        organizer: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred while adding the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="p-6 bg-white text-black rounded shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">Add New Event</h2>

      <div className="mb-4">
        <label className="block text-sm font-bold">Event Name</label>
        <input
          type="text"
          name="name"
          value={event.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Date</label>
        <input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Time</label>
        <input
          type="time"
          name="time"
          value={event.time}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Location</label>
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Description</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Image Link (optional)</label>
        <input
          type="url"
          name="imageLink"
          value={event.imageLink}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Number of Participants</label>
        <input
          type="number"
          name="participants"
          value={event.participants}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold">Organizer Name</label>
        <input
          type="text"
          name="organizer"
          value={event.organizer}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-purple-800 rounded hover:bg-purple-900"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Event"}
      </button>
    </form>
  );
};

export default EventForm;
