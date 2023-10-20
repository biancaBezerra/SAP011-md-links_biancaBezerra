const fs = require('fs');
const sinon = require('sinon');
const assert = require('assert');
const axios = require('axios');
const myCode = require ('../index.js')
const { 
  mdLinks,
  readFileAndExtractLinks,
  processDirectory,
  extractLinks,
  validateLinks,
  calculateStats
} = myCode;

describe('calculateStats', () => {
  it('deve calcular as estatísticas corretamente', () => {
    const links = [
      { href: 'https://example.com/1', status: 200 },
      { href: 'https://example.com/2', status: 404 },
      { href: 'https://example.com/3', status: 403 },
      { href: 'https://example.com/1', status: 200 },  // Link duplicado
    ];

    const stats = calculateStats(links);

    // Verifica se o cálculo do total de links está correto
    expect(stats.total).toBe(4);

    // Verifica se o cálculo de links únicos está correto
    expect(stats.unique).toBe(3);

    // Verifica se o cálculo de links quebrados está correto
    expect(stats.broken).toBe(2);
  });

  it('deve tratar um array vazio corretamente', () => {
    const links = [];
    const stats = calculateStats(links);

    // Para um array vazio, todas as estatísticas devem ser 0
    expect(stats.total).toBe(0);
    expect(stats.unique).toBe(0);
    expect(stats.broken).toBe(0);
  });
});

jest.mock('axios');

describe('validateLinks', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve validar os links corretamente', async () => {
    const links = [
      { href: 'https://example.com', text: 'Link 1' },
      { href: 'https://example.org', text: 'Link 2' },
    ];

    const axiosResponse = (status) => ({
      status,
      response: { status },
    });

    // Mock para o Axios
    axios.get
      .mockResolvedValueOnce(axiosResponse(200))  // Link 1 válido
      .mockResolvedValueOnce(axiosResponse(404)); // Link 2 inválido

    const validatedLinks = await validateLinks(links);

    // Verifica se os links foram validados corretamente
    expect(validatedLinks).toEqual([
      { href: 'https://example.com', text: 'Link 1', status: 200, ok: true },
      { href: 'https://example.org', text: 'Link 2', status: 404, ok: false },
    ]);
  });

  it('deve tratar erros de validação', async () => {
    const linkWithError = { href: 'https://example.com', text: 'Link with error' };

    // Simula um erro no Axios
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    const validatedLinks = await validateLinks([linkWithError]);

    // Verifica se o link com erro foi tratado corretamente
    expect(validatedLinks).toEqual([
      { ...linkWithError, status: 'N/A', ok: false },
    ]);
  });
});

describe('extractLinks', () => {
  // Add test cases for extractLinks function
});

describe('processDirectory', () => {
  // Add test cases for processDirectory function
});

describe('readFileAndExtractLinks', () => {
  // Teste para verificar se a leitura do arquivo e extração de links funciona corretamente
  it('deve ler o arquivo e extrair os links', (done) => {
    const mockFilePath = 'caminho/do/arquivo.md';
    const mockFileContent = 'Texto com [link](https://www.google.com)';

    // Mock para fs.readFile
    jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {
      callback(null, mockFileContent);
    });

    // Mock para extractLinks
    jest.spyOn(global, 'extractLinks').mockReturnValue([{ href: 'https://www.google.com', text: 'link', file: mockFilePath }]);

    // Chama a função
    readFileAndExtractLinks(mockFilePath, { validate: false })
      .then((links) => {
        expect(links).toHaveLength(1);
        expect(links[0].href).toBe('https://www.google.com');
        expect(links[0].text).toBe('link');
        expect(links[0].file).toBe(mockFilePath);
        done();
      })
      .catch(done);

    // Restaura os mocks após o teste
    fs.readFile.mockRestore();
    global.extractLinks.mockRestore();
  });

});

describe('mdLinks', () => {
  it('deve lidar com um arquivo', (done) => {
    const mockFilePath = 'README.md';
    const options = { validate: false };

    // Stub da função readFileAndExtractLinks
    sinon.stub(myCode, 'readFileAndExtractLinks').callsFake((filePath, options) => {
      assert.equal(filePath, mockFilePath);
      assert.deepEqual(options, options);
      done();
    });

    mdLinks(mockFilePath, options);

    // Restaura o stub após o teste
    myCode.readFileAndExtractLinks.restore();
  }, 20000);

});