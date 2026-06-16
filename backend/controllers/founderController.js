const mongoose = require('mongoose');
const Founder = require('../models/Founder');
const fs = require('fs');
const path = require('path');
const { saveFileToDb, deleteFileFromDb } = require('../utils/uploadHelper');

const FALLBACK_FOUNDER = {
  name: 'Balraj',
  title: 'Crypto Investment Advisor',
  shortDescription: 'Guiding investors through the world of cryptocurrency with strategic insights, blockchain expertise, and proven investment approaches designed for sustainable growth and long-term financial success.',
  bio: '',
  profilePhoto: '',
  coverImage: '',
  linkedinUrl: '',
  twitterUrl: '',
  telegramUrl: '',
  email: '',
  phone: '',
};

const getFounder = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: FALLBACK_FOUNDER });
    }

    let founder = await Founder.findOne();

    if (!founder) {
      founder = await Founder.create({});
    }

    res.json({
      success: true,
      data: founder,
    });
  } catch (error) {
    next(error);
  }
};

const updateFounder = async (req, res, next) => {
  try {
    const {
      name,
      title,
      shortDescription,
      bio,
      linkedinUrl,
      twitterUrl,
      telegramUrl,
      email,
      phone,
      removeProfilePhoto,
      removeCoverImage,
    } = req.body;

    let founder = await Founder.findOne();
    if (!founder) {
      founder = new Founder({});
    }

    if (name !== undefined) founder.name = name.trim();
    if (title !== undefined) founder.title = title.trim();
    if (shortDescription !== undefined) founder.shortDescription = shortDescription.trim();
    if (bio !== undefined) founder.bio = bio.trim();
    if (linkedinUrl !== undefined) founder.linkedinUrl = linkedinUrl.trim();
    if (twitterUrl !== undefined) founder.twitterUrl = twitterUrl.trim();
    if (telegramUrl !== undefined) founder.telegramUrl = telegramUrl.trim();
    if (email !== undefined) founder.email = email.trim();
    if (phone !== undefined) founder.phone = phone.trim();

    if (req.files) {
      if (req.files.profilePhoto) {
        if (founder.profilePhoto) {
          await deleteFileFromDb(founder.profilePhoto);
          const oldPath = path.join(__dirname, '..', founder.profilePhoto);
          try { fs.unlinkSync(oldPath); } catch {}
        }
        founder.profilePhoto = await saveFileToDb(req.files.profilePhoto[0], 'founder');
      }

      if (req.files.coverImage) {
        if (founder.coverImage) {
          await deleteFileFromDb(founder.coverImage);
          const oldPath = path.join(__dirname, '..', founder.coverImage);
          try { fs.unlinkSync(oldPath); } catch {}
        }
        founder.coverImage = await saveFileToDb(req.files.coverImage[0], 'founder');
      }
    }

    if (removeProfilePhoto === 'true' || removeProfilePhoto === true) {
      if (founder.profilePhoto) {
        await deleteFileFromDb(founder.profilePhoto);
        const oldPath = path.join(__dirname, '..', founder.profilePhoto);
        try { fs.unlinkSync(oldPath); } catch {}
      }
      founder.profilePhoto = '';
    }

    if (removeCoverImage === 'true' || removeCoverImage === true) {
      if (founder.coverImage) {
        await deleteFileFromDb(founder.coverImage);
        const oldPath = path.join(__dirname, '..', founder.coverImage);
        try { fs.unlinkSync(oldPath); } catch {}
      }
      founder.coverImage = '';
    }

    await founder.save();

    res.json({
      success: true,
      message: 'Founder profile updated successfully',
      data: founder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFounder, updateFounder };
