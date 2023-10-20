const fs = require('fs');
const path = require('path');
const axios = require('axios');

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return reject(new Error(`Error:${err.message}`));
      }

      if (stats.isFile() && filePath.endsWith('.md')) {
        return readFileAndExtractLinks(filePath, options).then(resolve).catch(reject);
      }

      if (stats.isDirectory()) {
        return processDirectory(filePath, options).then(resolve).catch(reject);
      }
      resolve([]);
    });
  });
}

function readFileAndExtractLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (readErr, content) => {
      if (readErr) {
        return reject(new Error(`Error reading file: ${readErr.message}`));
      }

      const links = extractLinks(content, filePath);
      if (options && options.validate) {
        return validateLinks(links).then(resolve).catch(reject);
      }

      resolve(links);
    });
  });
}

function processDirectory(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (readdirErr, files) => {
      if (readdirErr) {
        return reject(new Error(`Error reading directory: ${readdirErr.message}`));
      }

      const mdFiles = files.filter(file => path.extname(file) === '.md');
      const promises = mdFiles.map(file => mdLinks(path.join(filePath, file), options));
      
      Promise.all(promises)
        .then(results => resolve(results.reduce((acc, links) => acc.concat(links), [])))
        .catch(reject);
    });
  });
}

function extractLinks(content, filePath) {
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const links = [];

  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, text, href] = match;
    links.push({ href, text: text.trim(), file: filePath });
  }

  return links;
}

function validateLinks(links) {
  const linkPromises = links.map(link => {
    return axios
      .get(link.href)
      .then(response => ({
        ...link,
        status: response.status,
        ok: response.status >= 200 && response.status < 400 || response.status === 999
      }))
      .catch(error => ({
        ...link,
        status: error.response ? error.response.status : 'N/A',
        ok: error.response ? error.response.status === 999 : false
      }));
  });

  return Promise.all(linkPromises);
}

function calculateStats(links) {
  const totalLinks = links.length;
  const uniqueLinks = new Set(links.map(link => link.href)).size;
  const brokenLinks = links.filter(link => link.status === 404 || link.status === 403).length;
  const NALinks = links.filter(link => link.status === 'N/A').length;

  return { total: totalLinks, unique: uniqueLinks, broken: brokenLinks, nana: NALinks };
}

module.exports = {
  mdLinks,
  calculateStats,
  validateLinks,
  extractLinks,
  readFileAndExtractLinks,
  processDirectory
};
