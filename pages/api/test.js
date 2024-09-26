export default function handler(req, res) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    res.status(200).json({ clientIp: ip, userAgent});
  }