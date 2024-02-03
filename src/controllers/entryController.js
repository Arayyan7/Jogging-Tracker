const fs = require("fs");
const { calculateAverageReport } = require("../utils");
const path = require("path");

const entriesFilePath = path.join(__dirname, "../../data/entries.json");
const getAllEntries = (req, res) => {
  try {
    const userId = req.userId; // Get userId from authenticated user
    const userRole = req.userRole; // Get userRole from authenticated user

    const entries = getEntriesFromJson();

    if (userRole === "user") {
      // If user role is "user", filter entries for the specific user
      const userEntries = entries.filter((entry) => entry.userId === userId);
      res.json({ entries: userEntries });
    } else {
      // For "admin" or "user_manager" roles, apply filters and pagination as before
      const filteredEntries = applyFilters(entries, req.query);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const paginatedEntries = paginate(filteredEntries, page, pageSize);

      res.json({ entries: paginatedEntries });
    }
  } catch (error) {
    console.error("Error getting entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getEntryById = (req, res) => {
  const { id } = req.params;
  const entries = getEntriesFromJson();
  const entry = entries.find((entry) => entry.id === id);
  res.json({ entry });
};

const createEntry = (req, res) => {
  const { date, distance, time, location, userId } = req.body;

  if (location.toLowerCase() === "login") {
    const loginEntry = { id: generateUniqueId(), userId, date, distance, time, location, login: true };
    saveEntryToJson(loginEntry);
    res.status(201).json({ message: "Login entry created successfully", entry: loginEntry });
  } else {
    const joggingEntry = { id: generateUniqueId(), userId, date, distance, time, location, login: false };
    saveEntryToJson(joggingEntry);
    res.status(201).json({ message: "Jogging entry created successfully", entry: joggingEntry });
  }
};

const updateEntry = (req, res) => {
  const { id } = req.params;
  const { date, distance, time, location } = req.body;
  const entries = getEntriesFromJson();
  const index = entries.findIndex((entry) => entry.id === id);
  if (index !== -1) {
    entries[index] = { id, date, distance, time, location };
    saveEntriesToJson(entries);
    res.json({ message: "Entry updated successfully", entry: entries[index] });
  } else {
    res.status(404).json({ message: "Entry not found" });
  }
};

const deleteEntry = (req, res) => {
  const { id } = req.params;
  const entries = getEntriesFromJson();
  const updatedEntries = entries.filter((entry) => entry.id !== id);
  if (entries.length !== updatedEntries.length) {
    saveEntriesToJson(updatedEntries);
    res.json({ message: "Entry deleted successfully" });
  } else {
    res.status(404).json({ message: "Entry not found" });
  }
};

const getAverageReport = (req, res) => {
  const entries = getEntriesFromJson();
  const report = calculateAverageReport(entries);
  res.json({ report });
};

const getEntriesFromJson = () => {
  const entriesJson = fs.readFileSync(entriesFilePath, "utf8");
  return JSON.parse(entriesJson);
};

const saveEntryToJson = (entry) => {
  try {
    const entriesData = fs.readFileSync(entriesFilePath, "utf-8");
    const entries = JSON.parse(entriesData);

    entries.push(entry);
    fs.writeFileSync(entriesFilePath, JSON.stringify(entries, null, 2));
  } catch (error) {
    console.error("Error saving entry to JSON:", error);
  }
};
const applyFilters = (entries, filters) => {
  return entries.filter((entry) => {
    for (const key in filters) {
      if (entry[key] !== undefined) {
        const filterValue = filters[key];
        const entryValue = entry[key];

        if (typeof entryValue === "string" && typeof filterValue === "string") {
          if (entryValue.toLowerCase() !== filterValue.toLowerCase()) {
            return false;
          }
        } else {
          if (entryValue !== filterValue) {
            return false;
          }
        }
      }
    }
    return true;
  });
};


const paginate = (entries, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  return entries.slice(startIndex, endIndex);
};

const generateUniqueId = () => {
  return Date.now().toString();
};

module.exports = {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  getAverageReport,
  saveEntryToJson,
};
