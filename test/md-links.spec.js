const sinon = require('sinon');
const { mdLinks } = require('../src/md-links');

const fsMock = {
  stat: sinon.stub(),
};

const validateMock = {
  validateLinks: sinon.stub(),
};

describe('mdLinks', () => {
  it('deve chamar readDirectory para um diretório', () => {
    const directoryPath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes';
  
    return mdLinks(directoryPath, {validate: true})
      .then(() => {
      });
  });  

  it('deve chamar validateLinks para verificar links', () => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/validMarkdownFile.md';
    validateMock.validateLinks.withArgs(filePath).callsArgWith(1, null, { isFile: () => true });

    return mdLinks(filePath, { validate: true })
      .then(() => {
      });
  });

  it('deve chamar readAndExtractLinks para um arquivo Markdown válido', () => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/validMarkdownFile.md';
    fsMock.stat.withArgs(filePath).callsArgWith(1, null, { isFile: () => true });

    return mdLinks(filePath, { validate: true })
      .then(() => {
      });
  });

  it('deve retornar erro para um arquivo que não existe', () => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/nonExistentFile.txt';
    fsMock.stat.withArgs(filePath).callsArgWith(1, { code: 'ENOENT' });

    return mdLinks(filePath, {})
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });

  it('deve retornar erro para um arquivo inválido', () => {
    const filePath = 'D:/Documentos/LABORATORIA/SAP011-md-links_biancaBezerra/testes/invalidFile.txt';
  
    // Configurar o comportamento do fs.stat
    fsMock.stat.withArgs(filePath).callsArgWith(1, { code: 'ENOENT' });
  
    return mdLinks(filePath, {})
      .catch((error) => {
        expect(error).toBeInstanceOf(Error); // Verifica se é uma instância de Error
      });
  });
});
