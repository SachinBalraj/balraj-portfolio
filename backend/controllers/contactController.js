const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/email');

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({ name, email, phone, subject, message });

    try {
      await sendContactNotification({ name, email, phone, subject, message });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact };
