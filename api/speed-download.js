module.exports = function handler(req, res) {
  const requestedBytes = Number(req.query.bytes || 1000000);
  const bytes = Math.min(Math.max(requestedBytes, 1024), 3800000);
  const chunk = Buffer.alloc(64 * 1024, "E");
  const fullChunks = Math.floor(bytes / chunk.length);
  const remainder = bytes % chunk.length;

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Length", String(bytes));
  res.status(200);

  for (let index = 0; index < fullChunks; index += 1) {
    res.write(chunk);
  }

  if (remainder > 0) {
    res.write(chunk.subarray(0, remainder));
  }

  res.end();
};
