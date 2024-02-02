
const { startOfWeek, addWeeks } = require("date-fns");
const { v4: uuidv4 } = require("uuid");



const calculateAverageReport = (entries) => {
  const weeklyData = {};

  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    const weekStart = startOfWeek(entryDate);

    if (!weeklyData[weekStart]) {
      weeklyData[weekStart] = { totalDistance: 0, totalTime: 0, entryCount: 0 };
    }

    weeklyData[weekStart].totalDistance += entry.distance;
    weeklyData[weekStart].totalTime += entry.time;
    weeklyData[weekStart].entryCount += 1;
  });

  const report = Object.entries(weeklyData).map(([weekStart, data]) => {
    const averageDistance = data.totalDistance / data.entryCount;
    const averageSpeed = data.totalDistance / data.totalTime; 

    return {
      weekStart,
      averageDistance,
      averageSpeed,
    };
  });

  return report;
};

const generateUniqueId = () => {
  return uuidv4();
};

module.exports = { calculateAverageReport, generateUniqueId };
