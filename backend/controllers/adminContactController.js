const Contact = require('../models/Contact');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getContacts = async (req, res, next) => {
  try {
    const { search, startDate, endDate, isRead, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      const sanitized = escapeRegex(search);
      query.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
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

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Contact.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: contacts,
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

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true, runValidators: false }
    );

    if (!contact) {
      res.status(404);
      throw new Error('Contact not found');
    }

    res.json({
      success: true,
      message: 'Marked as read',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      res.status(404);
      throw new Error('Contact not found');
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getContacts, markAsRead, deleteContact };
