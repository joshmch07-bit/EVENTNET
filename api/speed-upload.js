module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let bytes = 0;

  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      bytes += chunk.length;
    });
    req.on("end", resolve);
    req.on("error", reject);
  });

  res.setHeader("Cache-Control", "no-store, max-age=0");
  return res.status(200).json({ receivedBytes: bytes });
};
