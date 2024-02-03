
const fs = require("fs");
const path = require("path");
const { generateUniqueId } = require("../utils"); 

const usersFilePath = path.join(__dirname, "../../data/users.json");

const getAllUsers = (req, res) => {
  try {
    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    const filteredUsers = applyFilters(users, req.query);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const paginatedUsers = paginate(filteredUsers, page, pageSize);

    res.json({ users: paginatedUsers });
  } catch (error) {
    console.error("Error reading users.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = (req, res) => {
  try {
    const userId = req.params.id;
    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error reading users.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUser = (req, res) => {
  try {
    const newUser = req.body;
    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    // Generate a unique ID for the new user
    newUser.id = generateUniqueId();

    const existingUser = users.find((u) => u.id === newUser.id);

    if (!existingUser) {
      users.push(newUser);
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    console.error("Error reading/writing users.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, ...updatedUserData };
      }
      return user;
    });

    fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error reading/writing users.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = (req, res) => {
  try {
    const userId = req.params.id;
    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);

    const updatedUsers = users.filter((user) => user.id !== userId);

    fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error reading/writing users.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const applyFilters = (users, filters) => {
  return users.filter((user) => {
    for (const key in filters) {
      if (user[key] !== filters[key]) {
        return false;
      }
    }
    return true;
  });
};

const paginate = (users, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  return users.slice(startIndex, endIndex);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
