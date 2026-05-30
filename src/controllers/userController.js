import createHttpError from 'http-errors';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const uploadedAvatar = await saveFileToCloudinary(req.file.buffer);

  req.user.avatar = uploadedAvatar.secure_url;
  await req.user.save();

  res.status(200).json({
    url: uploadedAvatar.secure_url,
  });
};
