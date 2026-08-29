import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const send_mail = async (from,to,subject,text,html) => {
    try {
    const info = await transporter.sendMail({
    from: `${from}`, // sender address
    to: `${to}`, // list of recipients
    subject: `${subject}`, // subject line
    text: `${text}`, // plain text body
    html: `${html}`, // HTML body
  });
   console.log("Message sent: ", info.messageId);

    } catch (err) {
  switch (err.code) {
    case "ECONNECTION":
    case "ETIMEDOUT":
      console.error("Network error - retry later:", err.message);
      break;
    case "EAUTH":
      console.error("Authentication failed:", err.message);
      break;
    case "EENVELOPE":
      // err.rejected is only present when every recipient was refused
      console.error("Invalid envelope:", err.message, err.rejected || []);
      break;
    default:
      console.error("Send failed:", err.message);
  }
}

}


export {send_mail}