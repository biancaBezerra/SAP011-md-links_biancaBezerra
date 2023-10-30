const axios = require('axios');

function extractLinks(content, filePath) {
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const links = [];

  let match;
  /* eslint-disable no-cond-assign */
  while ((match = regex.exec(content)) !== null) {
    const [, text, href] = match;
    links.push({ href, text: text.trim(), file: filePath });
  }
  /* eslint-enable no-cond-assign */

  return links;
}

function validateLinks(links) {
  const linkPromises = links.map((link) => axios
    .get(link.href)
    .then((response) => ({
      ...link,
      status: response.status,
      ok: response.status >= 200 && response.status < 400,
    }))
    .catch((error) => ({
      ...link,
      status: error.response ? error.response.status : 'ENOTFOUND',
    })));

  return Promise.all(linkPromises);
}

function calculateStats(links) {
  const totalLinks = links.length;
  const uniqueLinks = new Set(links.map((link) => link.href)).size;
  const brokenLinks = links.filter((link) => link.status === 404 || link.status === 403).length;
  const notAccessible = links.filter((link) => link.status === 999).length;
  const NALinks = links.filter((link) => link.status === 'ENOTFOUND').length;

  return {
    total: totalLinks, unique: uniqueLinks, broken: brokenLinks, not: notAccessible, nana: NALinks,
  };
}

module.exports = {
  calculateStats,
  validateLinks,
  extractLinks,
};
