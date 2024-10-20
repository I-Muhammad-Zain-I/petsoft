import { Resend } from "resend";

console.log("API Key:", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const sendVerifcationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
  });
};

const sendPasswordResetMail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  });
};

const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code is: ${token}</p>`,
  });
};

const sendPetSoftPurchaseCongratulations = async (email: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "PetSoft Lifetime Access Purchased!",
    html: `<p>Congratulations your purchasing Petsoft Successfully</p>`,
  });
};

export {
  sendVerifcationEmail,
  sendPasswordResetMail,
  sendTwoFactorTokenEmail,
  sendPetSoftPurchaseCongratulations,
};
