import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";
import { auth } from "../firebase";
import { sendEmail } from "../utils/sendMail";
import bgImage from "../assets/bg.jpg";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    setUser(auth.currentUser);

    const fetchEvent = async () => {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEvent(data);

        // Check if user is already registered
        if (data.participantsList && data.participantsList[auth.currentUser?.uid]) {
          setIsRegistered(true);
        }
      } else {
        console.error("No such document!");
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (event.participants <= 0) {
      alert("Sorry, the event is full!");
      return;
    }

    if (isRegistered) {
      alert("You are already registered for this event!");
      return;
    }

    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        participants: event.participants - 1,
        [`participantsList.${user.uid}`]: user.displayName || user.email,
      });

      const qrData = {
        eventName: event.name,
        date: event.date,
        time: event.time,
        location: event.location,
        userName: user.displayName || user.email,
      };
      setQrCode(JSON.stringify(qrData));

      await sendEmail(user.email, "Event Registration", "Here is your QR code for the event!", qrData);

      setIsRegistered(true);
      alert("You have successfully registered! Check your email for the QR code.");
    } catch (error) {
      console.error("Error registering: ", error);
      alert("An error occurred while registering for the event.");
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = svg.getBoundingClientRect().width;
    canvas.height = svg.getBoundingClientRect().height;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngFile;
      link.download = `${event.name}_QRCode.png`;
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-gray-900 bg-opacity-80"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-90 rounded shadow-md mt-10">
        <div className="flex flex-col md:flex-row">
          <img
            src={event.imageLink}
            alt={event.name}
            className="w-full md:w-1/2 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1 ml-0 md:ml-8 mt-6 md:mt-0">
            <h2 className="text-3xl font-bold mb-4">{event.name}</h2>
            <p className="text-gray-500">
              <strong>Date:</strong> {event.date} <br />
              <strong>Time:</strong> {event.time}
            </p>
            <p className="mt-4 text-lg">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="mt-4 text-gray-700">{event.description}</p>
            <p className="mt-4 font-bold">
              Participants Left: <span className="text-blue-500">{event.participants}</span>
            </p>
            {user && !isRegistered && event.participants > 0 && (
              <button
                onClick={handleRegister}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Register
              </button>
            )}
          </div>
        </div>
        {qrCode && (
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold mb-4">Your QR Code</h3>
            <div className="inline-block bg-gray-100 p-4 rounded-lg shadow-md">
              <QRCode value={qrCode} size={256} />
            </div>
            <button
              onClick={downloadQRCode}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Download QR Code
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Scan this QR code to confirm your registration at the event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
