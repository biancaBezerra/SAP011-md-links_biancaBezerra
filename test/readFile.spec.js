const fs = require('fs');
const { readAndExtractLinks } = require('../src/readFile');

// Mock do módulo 'fs'
jest.mock('fs');

describe('readAndExtractLinks', () => {
  it('deve resolver com links ao ler o arquivo', (done) => {
    // Mock da leitura de arquivo
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, 'Exemplo de conteúdo com [link](http://example.com)');
    });

    const filePath = 'exemplo.md';
    const options = { validate: false };

    readAndExtractLinks(filePath, options).then((result) => {
      expect(result).toEqual([
        {
          href: 'http://example.com',
          text: 'link',
          file: 'exemplo.md',
        },
      ]);
      done();
    });
  });

  it('deve rejeitar com um erro quando a leitura do arquivo falhar', (done) => {
    // Mock da leitura de arquivo com erro
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error('File read error'));
    });

    const filePath = 'nonexistent.md';
    const options = { validate: true };

    readAndExtractLinks(filePath, options).catch((error) => {
      expect(error.message).toBe('Error reading file: File read error');
      done();
    });
  });
});
