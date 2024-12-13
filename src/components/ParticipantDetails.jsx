import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";
import bgImage from "../assets/bg.jpg"; // Background image import

const ParticipantDetails = () => {
  const { id } = useParams();  // Get event id from URL
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [participantsList, setParticipantsList] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const eventData = docSnap.data();
        setEvent(eventData);
        setFormData(eventData);
        setParticipantsList(Object.entries(eventData.participantsList || {}));
      }
    };
    fetchEvent();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, formData);
      alert("Event updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event: ", error);
      alert("Failed to update event.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const eventRef = doc(db, "events", id);
      await deleteDoc(eventRef);
      alert("Event deleted successfully!");
      navigate("/admin"); // Use navigate() instead of history.push()
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("Failed to delete event.");
    }
  };

  const handleDeleteParticipant = async (uid) => {
    try {
      const eventRef = doc(db, "events", id);
      const updatedParticipants = { ...event.participantsList };
      delete updatedParticipants[uid];
      await updateDoc(eventRef, {
        participantsList: updatedParticipants,
        participants: event.participants - 1,
      });
      alert("Participant removed successfully!");
    } catch (error) {
      console.error("Error removing participant: ", error);
      alert("Failed to remove participant.");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-gray-900 bg-opacity-80 text-black"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">{event.name}</h2>
        <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
          {isEditing ? (
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold">Event Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Image Link:</label>
                  <input
                    type="url"
                    name="imageLink"
                    value={formData.imageLink}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Participants:</label>
                  <input
                    type="number"
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Participants Left:</strong> {event.participants}</p>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Participants</h3>
            {participantsList.length === 0 ? (
              <p>No participants registered yet.</p>
            ) : (
              participantsList.map(([uid, name]) => (
                <div key={uid} className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded shadow-sm">
                  <div className="flex items-center">
                    <QRCode value={`User: ${name}, Event: ${event.name}`} size={64} />
                    <p className="ml-4">{name}</p>
                  </div>
                  <button
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteParticipant(uid)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleEditToggle}
            >
              {isEditing ? "Cancel Edit" : "Edit Event"}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleDeleteEvent}
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetails;
