export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: 'knightstour',
    time: new Date().toISOString(),
  });
}
