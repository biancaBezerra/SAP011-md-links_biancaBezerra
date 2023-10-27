const axios = require('axios');

const {
  extractLinks,
  validateLinks,
  calculateStats,
} = require('../src/validate');

describe('calculateStats', () => {
  it('deve calcular as estatísticas corretamente', () => {
    const links = [
      { href: 'https://example.com/1', status: 200 },
      { href: 'https://example.com/2', status: 404 },
      { href: 'https://example.com/3', status: 403 },
      { href: 'https://example.com/1', status: 200 }, // Link duplicado
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

  it('deve validar os links corretamente', () => {
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
      .mockResolvedValueOnce(axiosResponse(200)) // Link 1 válido
      .mockResolvedValueOnce(axiosResponse(404)); // Link 2 inválido

    return validateLinks(links).then((validatedLinks) => {
      // Verifica se os links foram validados corretamente
      expect(validatedLinks).toEqual([
        {
          href: 'https://example.com', text: 'Link 1', status: 200, ok: true,
        },
        {
          href: 'https://example.org', text: 'Link 2', status: 404, ok: false,
        },
      ]);
    });
  });

  it('deve tratar erros de validação', () => {
    const linkWithError = { href: 'https://example.com', text: 'Link with error' };

    // Simula um erro no Axios
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    return validateLinks([linkWithError]).then((validatedLinks) => {
      // Verifica se o link com erro foi tratado corretamente
      expect(validatedLinks).toEqual([
        { ...linkWithError, status: 'ENOTFOUND', ok: false },
      ]);
    });
  });

  it('deve cobrir linhas de status no catch', () => {
    const linkWithStatus = { href: 'https://example.com', text: 'Link with status' };

    // Simula um erro no Axios com status no response
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    return validateLinks([linkWithStatus]).then((validatedLinks) => {
      // Verifica se o status no catch é coberto corretamente
      expect(validatedLinks).toEqual([
        { ...linkWithStatus, status: 500, ok: false },
      ]);
    });
  });

  it('deve cobrir linhas de status igual a 999', () => {
    const linkWithStatus999 = { href: 'https://example.com', text: 'Link with status 999' };

    // Simula um erro no Axios com status igual a 999 no response
    axios.get.mockRejectedValueOnce({ response: { status: 999 } });

    return validateLinks([linkWithStatus999]).then((validatedLinks) => {
      // Verifica se o status igual a 999 é coberto corretamente
      expect(validatedLinks).toEqual([
        { ...linkWithStatus999, status: 999, ok: true },
      ]);
    });
  });
});

describe('extractLinks', () => {
  it('deve extrair os links corretamente', () => {
    const content = `
      Este é um exemplo de [link1](https://www.link1.com).
      Aqui está outro [link2](https://www.link2.com).
    `;
    const filePath = 'exemplo.txt';

    const expectedLinks = [
      { href: 'https://www.link1.com', text: 'link1', file: 'exemplo.txt' },
      { href: 'https://www.link2.com', text: 'link2', file: 'exemplo.txt' },
    ];

    const actualLinks = extractLinks(content, filePath);

    expect(actualLinks).toEqual(expectedLinks);
  });

  it('deve retornar um array vazio se não houver links', () => {
    const content = 'Este é um texto sem links.';
    const filePath = 'exemplo.txt';

    const actualLinks = extractLinks(content, filePath);

    expect(actualLinks).toEqual([]);
  });
});
