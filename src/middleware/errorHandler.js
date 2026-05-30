import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  const status = createHttpError.isHttpError(err) ? err.status : 500;

  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};
