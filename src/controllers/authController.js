const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { saveEntryToJson } = require("../controllers/entryController");
const { generateUniqueId } = require("../utils");

const privateKeyPath = path.join(__dirname, "../../keys/private.key");
const publicKeyPath = path.join(__dirname, "../../keys/public.key");

const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

const usersFilePath = path.join(__dirname, "../../data/users.json");

const generateToken = (payload) => {
  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
};


const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, fs.readFileSync(publicKeyPath, "utf8"), { algorithms: ["RS256"] });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
const login = (req, res) => {
  try {
    const { username, password } = req.body;

    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      // Ensure the role is set before generating the token
      user.role = user.role || "user";

      const token = generateToken({ userId: user.id, role: user.role });

      const loginEntry = {
        id: generateUniqueId(),
        userId: user.id,
        date: new Date().toISOString(),
        distance: 0,
        time: new Date().getTime(),
        location: req.ip,
        login: true,
      };

      saveEntryToJson(loginEntry);
console.log("Token Payload:", jwt.decode(token, { complete: true }).payload);

      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const register = (req, res) => {
  try {
    const newUser = req.body;

    // Ensure the role is either "user" or "admin"
    newUser.role = newUser.role === "admin" ? "user" : newUser.role || "user";

    if (newUser.role === "admin") {
      return res.status(400).json({ error: "Admin cannot be registered" });
    }

    newUser.id = generateUniqueId();

    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    const existingUser = users.find((u) => u.username === newUser.username);

    if (!existingUser) {
      users.push(newUser);
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { register, login, authenticateUser };
