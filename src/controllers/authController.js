import { readFileSync } from 'node:fs';

import bcrypt from 'bcrypt';
import Handlebars from 'handlebars';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import {
  clearSessionCookies,
  createSession,
  setSessionCookies,
} from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';

const RESET_PASSWORD_TEMPLATE = Handlebars.compile(
  readFileSync(new URL('../templates/reset-password-email.html', import.meta.url), 'utf-8'),
);

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw createHttpError(500, 'Server configuration error');
  }

  return process.env.JWT_SECRET;
};

const getResetPasswordLink = (token) => {
  if (!process.env.FRONTEND_DOMAIN) {
    throw createHttpError(500, 'Server configuration error');
  }

  const resetPasswordUrl = new URL('/reset-password', process.env.FRONTEND_DOMAIN);

  resetPasswordUrl.searchParams.set('token', token);

  return resetPasswordUrl.toString();
};

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteMany({ userId: user._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken || !isValidObjectId(sessionId)) {
    throw createHttpError(401, 'Session not found');
  }

  const currentSession = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: currentSession._id, refreshToken });

  const newSession = await createSession(currentSession.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId && isValidObjectId(sessionId)) {
    await Session.deleteOne({ _id: sessionId });
  }

  clearSessionCookies(res);

  res.status(204).send();
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(200).json({
      message: 'Password reset email sent successfully',
    });
    return;
  }

  const resetToken = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      type: 'reset-password',
    },
    getJwtSecret(),
    {
      expiresIn: '15m',
    },
  );

  try {
    const html = RESET_PASSWORD_TEMPLATE({
      name: user.username,
      link: getResetPasswordLink(resetToken),
    });

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;

  try {
    payload = jwt.verify(token, getJwtSecret());
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  if (payload.type !== 'reset-password' || !payload.sub || !payload.email) {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await User.findOne({
    _id: payload.sub,
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await Session.deleteMany({ userId: user._id });

  clearSessionCookies(res);

  res.status(200).json({
    message: 'Password reset successfully',
  });
};
