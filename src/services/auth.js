import { randomBytes } from 'node:crypto';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

const isProduction = process.env.NODE_ENV === 'production';

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

const createToken = () => randomBytes(30).toString('hex');

export const createSession = async (userId) => {
  return Session.create({
    userId,
    accessToken: createToken(),
    refreshToken: createToken(),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken', SESSION_COOKIE_OPTIONS);
  res.clearCookie('refreshToken', SESSION_COOKIE_OPTIONS);
  res.clearCookie('sessionId', SESSION_COOKIE_OPTIONS);
};
