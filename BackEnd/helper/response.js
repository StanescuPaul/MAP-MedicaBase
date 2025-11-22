export function sendSucces(res, data, status) {
  res.status(status).json({
    success: "success",
    data,
  });
}

export function sendError(res, message, status) {
  res.status(status).json({
    success: "error",
    message,
  });
}
