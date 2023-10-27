const fs = require('fs');
const { extractLinks, validateLinks } = require('./validate');

function readAndExtractLinks(filePath, options) {
  return new Promise((resolve, reject) => {
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
  });
}

module.exports = { readAndExtractLinks };
