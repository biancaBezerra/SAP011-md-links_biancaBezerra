const fs = require('fs');
const path = require('path');
const { extractLinks, validateLinks } = require('./validate');

function readAndExtractLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    if (path.extname(filePath) === '.md') {
    fs.readFile(filePath, 'utf-8', (readErr, content) => {
      if (readErr) {
        reject(new Error(`Error reading file: ${readErr.message}`));
      } else {
        const links = extractLinks(content, filePath);
        if (options && options.validate) {
          validateLinks(links)
            .then(resolve)
            .catch(reject);
        } else {
          resolve(links);
        }
      }
    });
   }
  });
}

module.exports = { readAndExtractLinks };
