import sgMail from '@sendgrid/mail';

const sendgridAPIKey = process.env.SENDGRID_API_KEY || '';
const fromEmail = process.env.SENDGRID_FROM_EMAIL || '';

sgMail.setApiKey(sendgridAPIKey);

export const sendWelcomeEmail = (email: string, name: string) => {
  sgMail.send({
    to: email,
    from: fromEmail,
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

export const sendCancelationEmail = (email: string, name: string) => {
  sgMail.send({
    to: email,
    from: fromEmail,
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  });
};
