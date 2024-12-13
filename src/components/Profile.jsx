import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setFormData(userSnap.data());
        // Fetch user events
        const userEvents = userSnap.data().events || [];
        setEvents(userEvents);
      } else {
        console.log("User data not found.");
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">User Profile</h2>

      <div className="flex items-center space-x-4 mb-6">
        <img
          src={userData.photoURL || "/default-avatar.png"} // Google photoURL or default
          alt="User Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          {isEditing ? (
            <input
              type="text"
              name="displayName"
              value={formData.displayName || userData.displayName}
              onChange={handleChange}
              className="p-2 rounded border"
            />
          ) : (
            <span className="font-semibold">{userData.displayName}</span>
          )}
          <p className="text-gray-600">{userData.email}</p>
        </div>
      </div>

      {/* Edit Profile or Save */}
      <div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Display Registered Events */}
      <h3 className="text-xl font-semibold mt-8">Registered Events</h3>
      <div className="mt-4">
        {events.length === 0 ? (
          <p>No events registered yet.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{event.name}</p>
              <p className="text-sm text-gray-600">{event.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
