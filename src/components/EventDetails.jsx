import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";
import { auth } from "../firebase";
import { sendEmail } from "../utils/sendMail";  // Ensure sendEmail is updated to handle Base64
import bgImage from "../assets/bg.jpg";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [base64QrCode, setBase64QrCode] = useState(""); // Store Base64 QR code here
  const qrRef = useRef(null); // Ref for QR code

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

      // Wait for the QR code to be rendered
      setTimeout(() => {
        if (qrRef.current) {
          const svg = qrRef.current.querySelector("svg");
          
          if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            canvas.width = svg.getBoundingClientRect().width;
            canvas.height = svg.getBoundingClientRect().height;

            img.onload = () => {
              ctx.drawImage(img, 0, 0);
              const base64Image = canvas.toDataURL("image/png");  // Convert to Base64 PNG image
              setBase64QrCode(base64Image);

              // Send email with Base64 QR Code
              sendEmail(user.email, "Event Registration", "Here is your QR code for the event!", base64Image);

              setIsRegistered(true);
              alert("You have successfully registered! Check your email for the QR code.");
            };

            img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
          } else {
            console.error("SVG element not found in the QR code.");
          }
        }
      }, 500); // Ensure QR Code has been rendered before serializing

    } catch (error) {
      console.error("Error registering: ", error);
      alert("An error occurred while registering for the event.");
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;
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
      className="min-h-screen bg-cover bg-center bg-gray-900 bg-opacity-80 flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto p-8 bg-white bg-opacity-90 rounded-lg shadow-xl">
        {/* Event Image and Details */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={event.imageLink}
            alt={event.name}
            className="w-full md:w-1/2 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">{event.name}</h2>
            <p className="text-gray-500 text-lg">
              <strong>Date:</strong> {event.date} <br />
              <strong>Time:</strong> {event.time}
            </p>
            <p className="mt-4 text-lg">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="mt-4 text-gray-700 text-lg">{event.description}</p>
            <p className="mt-4 font-bold text-lg">
              Participants Left: <span className="text-blue-500">{event.participants}</span>
            </p>

            {/* Conditionally render the Register button */}
            {!isRegistered && event.participants > 0 && (
              <button
                onClick={handleRegister}
                className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
              >
                Register
              </button>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        {qrCode && (
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold mb-6 text-blue-600">Your QR Code</h3>
            <div className="relative inline-block bg-gray-100 p-8 rounded-lg shadow-md">
              {/* Download Button on top of QR Code */}
              <button
                onClick={downloadQRCode}
                className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none transition duration-300 z-10"
              >
                Download QR Code
              </button>
              <div className="mt-10">
                <QRCode ref={qrRef} value={qrCode} size={256} />
              </div>
            </div>
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
