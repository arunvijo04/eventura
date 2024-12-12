import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code"; // For generating QR codes
import { auth } from "../firebase"; // Firebase auth
import { sendEmail } from "../utils/sendMail" // (you'll create this function to send email with the QR)

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null); // To track the user registering
  const [isRegistered, setIsRegistered] = useState(false); // To check if the user is already registered
  const [qrCode, setQrCode] = useState(""); // QR code data

  useEffect(() => {
    // Set user data from auth
    setUser(auth.currentUser);

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

  const handleRegister = async () => {
    if (event.participants <= 0) {
      alert("Sorry, the event is full!");
      return;
    }

    // Check if the user is already registered
    if (isRegistered) {
      alert("You are already registered for this event!");
      return;
    }

    // Update Firestore to decrease the participant count and add user to event
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        participants: event.participants - 1,
        [`participantsList.${user.uid}`]: user.displayName || user.email, // Track participants by user UID
      });

      // Generate a QR code with the event details
      const qrData = {
        eventName: event.name,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
      };
      setQrCode(JSON.stringify(qrData));

      // Send QR code to user (you'll implement this function)
      await sendEmail(user.email, "Event Registration", "Here is your QR code for the event!", qrData);

      // Update state to show registration success
      setIsRegistered(true);
      alert("You have successfully registered! Check your email for the QR code.");
    } catch (error) {
      console.error("Error registering: ", error);
      alert("An error occurred while registering for the event.");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold">{event.name}</h2>
      <p className="text-sm text-gray-500">
        {event.date} at {event.time}
      </p>
      <p className="mt-2 font-semibold">Location: {event.location}</p>
      <p className="mt-2">{event.description}</p>
      
      {/* Show register button if user is logged in and not already registered */}
      {user && !isRegistered && event.participants > 0 && (
        <button
          onClick={handleRegister}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
      )}

      {/* Show the QR code after registration */}
      {qrCode && (
        <div className="mt-6">
          <h3 className="font-bold">Your QR Code:</h3>
          <QRCode value={qrCode} size={256} />
          <p className="mt-2 text-sm text-gray-500">Scan this QR code to confirm your registration.</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
