export function notFound(req, res) {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message =
    status === 500 ? "Terjadi kesalahan di server" : err.message;

  console.error(`[${status}] ${req.method} ${req.path} — ${err.message}`);

  res.status(status).json({ error: message });
}
