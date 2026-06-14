const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const buildContactHTML = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fafafa; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
    <div style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div style="width: 48px; height: 48px; margin: 0 auto 12px; background: linear-gradient(135deg, #22C55E, #16A34A); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #050505;">B</div>
      <h1 style="margin: 0; font-size: 20px; color: #22C55E;">New Contact Request</h1>
    </div>
    <div style="padding: 24px 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        ${[
          ['Name', data.name],
          ['Email', data.email],
          ['Phone', data.phone],
          ['Subject', data.subject],
          ['Message', data.message],
        ].map(([label, value]) => `
          <tr>
            <td style="padding: 8px 12px 8px 0; font-size: 12px; color: #A1A1AA; vertical-align: top; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,0.03);">${label}</td>
            <td style="padding: 8px 0; font-size: 13px; color: #fafafa; border-bottom: 1px solid rgba(255,255,255,0.03);">${value}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    <div style="padding: 16px 32px; text-align: center; font-size: 11px; color: #52525B; border-top: 1px solid rgba(255,255,255,0.05);">
      Balraj Portfolio &mdash; Digital Asset Advisory
    </div>
  </div>
`;

const buildConsultationHTML = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fafafa; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
    <div style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div style="width: 48px; height: 48px; margin: 0 auto 12px; background: linear-gradient(135deg, #22C55E, #16A34A); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #050505;">B</div>
      <h1 style="margin: 0; font-size: 20px; color: #22C55E;">New Consultation Booking</h1>
    </div>
    <div style="padding: 24px 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        ${[
          ['Name', data.fullName],
          ['Email', data.email],
          ['Phone', data.phone],
          ['Company', data.company || 'N/A'],
          ['Investment Budget', data.investmentBudget],
          ['Meeting Date', data.meetingDate],
          ['Meeting Time', data.meetingTime],
          ['Notes', data.notes || 'N/A'],
        ].map(([label, value]) => `
          <tr>
            <td style="padding: 8px 12px 8px 0; font-size: 12px; color: #A1A1AA; vertical-align: top; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,0.03);">${label}</td>
            <td style="padding: 8px 0; font-size: 13px; color: #fafafa; border-bottom: 1px solid rgba(255,255,255,0.03);">${value}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    <div style="padding: 16px 32px; text-align: center; font-size: 11px; color: #52525B; border-top: 1px solid rgba(255,255,255,0.05);">
      Balraj Portfolio &mdash; Digital Asset Advisory
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Balraj Portfolio" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

const sendContactNotification = async (data) => {
  return sendEmail({
    to: process.env.EMAIL_USER,
    subject: 'New Contact Request',
    html: buildContactHTML(data),
  });
};

const sendConsultationNotification = async (data) => {
  return sendEmail({
    to: process.env.EMAIL_USER,
    subject: 'New Consultation Booking',
    html: buildConsultationHTML(data),
  });
};

module.exports = {
  sendContactNotification,
  sendConsultationNotification,
};
