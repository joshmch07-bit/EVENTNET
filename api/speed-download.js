const crypto = require("crypto");

module.exports = function handler(req, res) {
  const requestedBytes = Number(req.query.bytes || 1000000);
  const bytes = Math.min(Math.max(requestedBytes, 1024), 10000000);

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Length", String(bytes));
  res.status(200).send(crypto.randomBytes(bytes));
};
