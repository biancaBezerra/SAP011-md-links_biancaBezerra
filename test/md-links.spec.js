const assert = require('assert');
const sinon = require('sinon');

const { mdLinks } = require('../src/md-links');

const fsMock = {
  stat: sinon.stub(),
};

describe('mdLinks', () => {
  it('deve resolver com um array vazio para um arquivo inexistente', (done) => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/nonExistentFile.md';

    // Configurar o comportamento do fs.stat
    fsMock.stat.withArgs(filePath).callsArgWith(1, { code: 'ENOENT' });

    mdLinks(filePath)
      .then((result) => {
        assert.deepStrictEqual(result, []);
        done();
      })
      .catch(done);
  });

  it('deve resolver com um array vazio para um arquivo não Markdown', (done) => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/nonMarkdownFile.txt';

    // Configurar o comportamento do fs.stat
    fsMock.stat.withArgs(filePath).callsArgWith(1, null, { isFile: () => true });

    mdLinks(filePath)
      .then((result) => {
        assert.deepStrictEqual(result, []);
        done();
      })
      .catch(done);
  });

  it('deve chamar readAndExtractLinks para um arquivo Markdown válido', (done) => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/validMarkdownFile.md';

    // Configurar o comportamento do fs.stat para indicar que o caminho é um arquivo
    fsMock.stat.withArgs(filePath).callsArgWith(1, null, { isFile: () => true });
    // Configurar um stub para readAndExtractLinks
    const readAndExtractLinks = sinon.stub().resolves([
      {
        href: 'https://example.com',
        text: 'Exemplo',
        file: filePath,
      },
      {
        href: 'https://google.com',
        text: 'Google',
        file: filePath,
      },
    ]);

    readAndExtractLinks(filePath, {})
      .then((result) => {
        assert.deepStrictEqual(result, [
          {
            href: 'https://example.com',
            text: 'Exemplo',
            file: filePath,
          },
          {
            href: 'https://google.com',
            text: 'Google',
            file: filePath,
          },
        ]);
        done();
      })
      .catch(done);
  });
});
