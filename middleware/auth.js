const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.APP_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
