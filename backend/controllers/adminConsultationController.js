const Consultation = require('../models/Consultation');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getConsultations = async (req, res, next) => {
  try {
    const { search, startDate, endDate, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      const sanitized = escapeRegex(search);
      query.$or = [
        { fullName: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
        { phone: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [consultations, total] = await Promise.all([
      Consultation.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Consultation.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Contacted', 'Converted', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      res.status(404);
      throw new Error('Consultation not found');
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      res.status(404);
      throw new Error('Consultation not found');
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConsultations, updateStatus, deleteConsultation };
