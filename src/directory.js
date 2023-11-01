const { log } = require('console');
const fs = require('fs');
const path = require('path');

function readDirectory(filePath, options, mdLinks) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (readdirErr, files) => {
      if (readdirErr) {
        reject(new Error(`Error reading directory: ${readdirErr.message}`));
      }
      const promises = files.map((file) => mdLinks(path.join(filePath, file), options));
      // const mdFiles = promises.filter((file) => path.extname(file) === '.md');
      Promise.all(promises)
        .then((results) => {
          const allLinks = results.reduce((acc, links) => acc.concat(links), []);
          // console.log(allLinks);
          resolve(allLinks);
        })
        .catch(reject);
    });
  });
}

module.exports = { readDirectory };
