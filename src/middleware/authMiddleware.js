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

    // Set req properties with decoded user information
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    console.log("Decoded Token:", decoded); // Add this line for debugging

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};



const authorize = (allowedRoles) => {
  return (req, res, next) => {
    console.log("req.userId:", req.userId); 
    console.log("req.userRole:", req.userRole); 

    const isUserAllowed =
      allowedRoles.includes(req.userRole) || (req.userRole === "user" && req.userId === req.params.id);

    if (!req.userId || !isUserAllowed) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  };
};



module.exports = { authenticate, authorize };
