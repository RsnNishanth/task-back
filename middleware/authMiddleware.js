const JWT = require("jsonwebtoken");

function auth(req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied!" });
  }

  // Support both "Bearer <token>" and "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied!" });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET );
    req.user = decoded; // { id: ... }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token not valid!", error: err.message });
  }
}

module.exports = auth;
