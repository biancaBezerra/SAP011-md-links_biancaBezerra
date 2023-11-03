const fs = require('fs');

const { readDirectory } = require('./directory');
const { readAndExtractLinks } = require('./readFile');

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      if (stats.isFile() && filePath.endsWith('.md')) {
        return readAndExtractLinks(filePath, options)
          .then(resolve)
          .catch(reject);
      } else if (stats.isDirectory()) {
        return readDirectory(filePath, options, mdLinks)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

module.exports = { mdLinks };
