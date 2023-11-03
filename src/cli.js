#!/usr/bin/env node
const chalk = require('chalk');

const { mdLinks } = require('./md-links');
const { validateLinks, calculateStats } = require('./validate');

const filePath = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
};

const printBox = (title, links, fileColor) => {
  console.log(
    chalk.hex('#b6a3ea')(
      '\n',
      `     ╔════════════════════════╗
      ║ ${title} ║
      ╚════════════════════════╝`,
    ),
    '\n',
  );

  let currentFile = '';

  links.forEach((link) => {
    if (link.file !== currentFile) {
      console.log(`${chalk.black.bgKeyword(fileColor)(link.file)}:`);
      currentFile = link.file;
    }
    const linkStatus = options.validate
      ? `${link.ok ? chalk.green('Válido') : chalk.red('Inválido')} || Status: ${link.status}`
      : chalk.hex('#fdc9d9')(link.text);
    console.log(`\u2022 ${chalk.hex('#c6e2ff')(link.href)} || ${linkStatus}`);
  });
};

const printCalculateStats = (links) => {
  console.log(
    chalk.hex('#b6a3ea')(
      '\n',
      `     ╔═══════════════════════════╗
      ║ Estatísticas dos Links \ud83d\udcca ║
      ╚═══════════════════════════╝`,
    ),
    '\n',
  );

  const stats = calculateStats(links);

  const statsText = `
    ${chalk.hex('#B6FCD5')('Total de links:')} ${chalk.hex('#fdc9d9')(stats.total)}
    ${chalk.hex('#B6FCD5')('Links únicos:')} ${chalk.hex('#fdc9d9')(stats.unique)}
    ${options.validate && options.stats ? `${chalk.hex('#B6FCD5')('Links Quebrados:')} ${chalk.hex('#fdc9d9')(stats.broken)}` : ''}
    ${options.validate && options.stats ? `${chalk.hex('#B6FCD5')('Links Não acessíveis:')} ${chalk.hex('#fdc9d9')(stats.not)}` : ''}
    ${options.validate && options.stats ? `${chalk.hex('#B6FCD5')('ENOTFOUND:')} ${chalk.hex('#fdc9d9')(stats.nana)}` : ''}
  `;

  console.log(statsText);
};

mdLinks(filePath, options)
  .then((links) => {
    if (options.validate && !options.stats) {
      validateLinks(links)
        .then((validatedLinks) => {
          printBox('Links Validados   \ud83d\udd0d\ud83d\udcc4', validatedLinks, 'lightpink');
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao validar os links:', error);
        });
    } else if (!options.validate && options.stats) {
      printCalculateStats(links);
    } else if (options.validate && options.stats) {
      validateLinks(links)
        .then((validatedLinks) => {
          printCalculateStats(validatedLinks);
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao validar os links:', error);
        });
    } else {
      printBox('Links Encontrados \ud83d\udd0d\ud83d\udcc4', links, 'lightgreen');
    }
  })
  .catch((error) => {
    console.error('Ocorreu um erro:', error);
  });
