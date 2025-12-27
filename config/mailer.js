import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "QuicKart <onboarding@resend.dev>",
      to: email,
      subject: "QuicKart Login OTP",
      html: `
        <h2>QuicKart Verification Code</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("OTP email sent to", email);
  } catch (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send OTP email");
  }
};

export default sendOtpEmail;
