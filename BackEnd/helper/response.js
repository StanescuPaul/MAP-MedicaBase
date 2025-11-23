export function sendSucces(res, data, status) {
  res.status(status).json({
    type: "success",
    data,
  });
}

export function sendError(res, message, status) {
  res.status(status).json({
    type: "error",
    message,
  });
}
