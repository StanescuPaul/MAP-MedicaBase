export function sendSucces(res, data, status) {
  res.status(status).json({
    success: true,
    data,
  });
}

export function sendError(res, meassage, status) {
  res.status(status).json({
    success: false,
    meassage,
  });
}
