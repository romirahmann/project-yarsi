const fs = require("fs");
const moment = require("moment");
const path = require("path");

class Logger {
  constructor(logFileName = "../exports/app.log") {
    this.logFilePath = path.join(__dirname, logFileName);
  }

  log(message = "[]", level = "SUCCESSFULLY") {
    const timestamp = new Date();

    const logMessage = `[${level}]-[${moment(timestamp).format(
      "DD-MM-YYYY HH:mm:ss"
    )}]  ${message}\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) console.error("Error writing log:", err);
    });
  }
}

// Export instance logger agar bisa digunakan di file lain
module.exports = new Logger();
