// utils/sendEmail.js

export const sendEmail = async (to, subject, body, qrBase64) => {
  try {
    const response = await fetch('http://localhost:5000/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        qrData: qrBase64, // Pass the QR code as Base64
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const data = await response.json();
    console.log(data.message);  // Log success message returned from backend
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
