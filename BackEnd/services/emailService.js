import { Resend } from "resend";

// =====================================================
// SEND PASSWORD RESET EMAIL
// =====================================================

const sendPasswordResetEmail = async (
  email,
  resetUrl
) => {

  // Make sure API key exists
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  // Create Resend client only when email is sent
  const resend = new Resend(apiKey);

  const { data, error } =
    await resend.emails.send({

      from: "Project LOOP <onboarding@resend.dev>",

      to: [email],

      subject:
        "Reset Your Project LOOP Password",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 24px;
          "
        >
          <h2>Reset Your Password</h2>

          <p>
            You requested a password reset for your
            <strong>Project LOOP</strong> account.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <p style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                background: #2563eb;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This password reset link expires in 15 minutes.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p>
            — Project LOOP Team
          </p>
        </div>
      `,
    });


  if (error) {

    console.error(
      "Resend email error:",
      error
    );

    throw new Error(
      "Unable to send password reset email."
    );
  }


  return data;
};


export {
  sendPasswordResetEmail
};
