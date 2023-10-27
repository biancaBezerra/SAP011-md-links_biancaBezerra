const fs = require('fs');
const path = require('path');

function readDirectory(filePath, options, mdLinks) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (readdirErr, files) => {
      if (readdirErr) {
        reject(new Error(`Error reading directory: ${readdirErr.message}`));
      }

      const mdFiles = files.filter((file) => path.extname(file) === '.md');
      const promises = mdFiles.map((file) => mdLinks(path.join(filePath, file), options));

      Promise.all(promises)
        .then((results) => {
          const allLinks = results.reduce((acc, links) => acc.concat(links), []);
          resolve(allLinks);
        })
        .catch(reject);
    });
  });
}

module.exports = { readDirectory };
