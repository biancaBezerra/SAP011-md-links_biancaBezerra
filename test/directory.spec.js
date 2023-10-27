const fs = require('fs');
const path = require('path');
const { readDirectory } = require('../src/directory');

jest.mock('fs');

describe('readDirectory', () => {
  it('deve ler um diretório e retornar os links de arquivos .md', () => {
    const mockMdFiles = ['file1.md', 'file2.md'];
    const mockMdLinks = jest.fn();
    const filePath = '/caminho/do/diretorio';

    fs.readdir.mockImplementation((path, callback) => {
      callback(null, mockMdFiles);
    });

    mockMdLinks.mockResolvedValue([]);

    return readDirectory(filePath, {}, mockMdLinks).then((links) => {
      expect(mockMdLinks).toHaveBeenCalledTimes(mockMdFiles.length);
      expect(mockMdLinks).toHaveBeenCalledWith(path.join(filePath, 'file1.md'), {});
      expect(mockMdLinks).toHaveBeenCalledWith(path.join(filePath, 'file2.md'), {});
      expect(links).toEqual([]);
    });
  });

  it('deve tratar erros ao ler o diretório', () => {
    const filePath = '/caminho/do/diretorio';

    const mockMdLinks = jest.fn();

    return readDirectory(filePath, {}, mockMdLinks).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error reading directory: Erro ao ler diretório');
      expect(mockMdLinks).not.toHaveBeenCalled();
    });
  });
});
