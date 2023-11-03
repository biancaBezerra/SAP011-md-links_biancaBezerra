const fs = require('fs');
const path = require('path');

function readDirectory(filePath, options, mdLinks) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      const promises = files.map((file) => {
        const fullPath = path.join(filePath, file);

        return new Promise((resolve) => {
          fs.stat(fullPath, (err, stats) => {
            if (err) {
              resolve([]);
            }
            if (stats.isDirectory()) {
              // Se o caminho atual for um diretório, chame readDirectory recursivamente.
              readDirectory(fullPath, options, mdLinks)
                .then(resolve)
                .catch(reject);
            } else if (stats.isFile() && file.endsWith('.md')) {
              // Se for um arquivo .md, chame a função mdLinks para extrair links.
              mdLinks(fullPath, fullPath, options)
                .then(resolve)
                .catch(reject);
            } else {
              resolve([]);
            }
          });
        });
      });

      Promise.all(promises)
        .then((results) => {
          const allLinks = results.flat();
          resolve(allLinks);
        })
        .catch(reject);
    });
  });
}

module.exports = { readDirectory };
