const jwt = require("jsonwebtoken");
const fs = require("fs");

const publicKeyPath = "./keys/public.key";
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

const authenticate = (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - Missing or invalid token" });
    }

    const token = authorizationHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
