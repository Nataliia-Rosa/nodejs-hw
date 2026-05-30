export const errorHandler = (err, req, res, _next) => {
  const status =
    err.status || (err.name === 'ValidationError' || err.name === 'MulterError' ? 400 : 500);

  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};
