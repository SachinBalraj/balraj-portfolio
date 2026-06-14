const Consultation = require('../models/Consultation');

const { sendConsultationNotification } = require('../utils/email');

const createConsultation = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      company,
      investmentBudget,
      meetingDate,
      meetingTime,
      notes,
    } = req.body;

    const consultation = await Consultation.create({
      fullName,
      email,
      phone,
      company,
      investmentBudget,
      meetingDate,
      meetingTime,
      notes,
    });

    try {
      await sendConsultationNotification({
        fullName,
        email,
        phone,
        company,
        investmentBudget,
        meetingDate,
        meetingTime,
        notes,
      });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted',
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createConsultation };
