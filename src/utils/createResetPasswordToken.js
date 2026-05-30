import jwt from 'jsonwebtoken';

export const createResetPasswordToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};
