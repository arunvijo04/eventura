// utils/sendEmail.js (example)

export const sendEmail = async (to, subject, body, qrData) => {
    try {
      // Example using an email API (e.g., SendGrid or your backend)
      const response = await fetch("https://your-email-api.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          qrData, // Pass the QR data as part of the email content
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
  
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  