const fs = require('fs');

const { readDirectory } = require('./directory');
const { readAndExtractLinks } = require('./readFile');

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(new Error(`Error:${err.message}`));
      }
      if (stats.isFile() && filePath.endsWith('.md')) {
        readAndExtractLinks(filePath, options)
          .then(resolve)
          .catch(reject);
      } else if (stats.isDirectory()) {
        readDirectory(filePath, options, mdLinks)
          .then(resolve)
          .catch(reject);
      } else {
        resolve([]);
      }
    });
  });
}

module.exports = { mdLinks };
