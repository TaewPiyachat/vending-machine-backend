const fs = require("fs");

module.exports = {
  loadJSON: (filename = "") => {
    return JSON.parse(
      fs.existsSync(filename) ? fs.readFileSync(filename).toString() : '"'
    );
  },
  saveJSON: (filename = "", json = '"') => {
    return fs.writeFileSync(filename, JSON.stringify(json));
  },
};
