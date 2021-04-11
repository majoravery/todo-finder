import * as path from 'path';
import * as fs from 'fs';
import TodoFinder from '../todoFinder';

const rootTestDirectory = path.resolve('./tmp');

const createFolder = (name: string, directory: string): string => {
  const folderPath = path.resolve(directory, name);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  return folderPath;
};

const createFile = (filePath: string, hasTodo: boolean): void => {
  let contents = '';
  if (hasTodo) {
    contents = `const foo = 'bar';\n// "TODO"\nconst bar = 'baz';\n`;
  } else {
    contents = `const foo = 'bar';\nconst bar = 'baz';\n`;
  }
  fs.writeFileSync(filePath, contents);
};

describe('TodoFinder', () => {
  beforeEach(() => {
    if (!fs.existsSync(rootTestDirectory)) {
      createFolder(rootTestDirectory, './');
    }
  });

  afterEach(() => {
    if (fs.existsSync(rootTestDirectory)) {
      fs.rmdirSync(rootTestDirectory, { recursive: true });
    }
  });

  describe('findFiles', () => {
    describe('should not find any files if', () => {
      it('directory is empty', () => {
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toHaveLength(0);
      });

      it('subfolder in directory is empty', () => {
        const folderPath = createFolder('somedir', rootTestDirectory);
        const finder = new TodoFinder();
        finder.findFiles(folderPath);
        expect(finder.getFoundPaths()).toHaveLength(0);
      });

      it('directory has 0 qualifying files', () => {
        const filePath = path.resolve(rootTestDirectory, 'file.js');
        createFile(filePath, false);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toHaveLength(0);
      });

      it('directory has 1 subfolder with 0 qualifying files within', () => {
        const folderPath = createFolder('somedir', rootTestDirectory);
        const filePath = path.resolve(folderPath, 'file.js');
        createFile(filePath, false);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toHaveLength(0);
      });
    });

    describe('should find 1 file if', () => {
      it('directory has 1 qualifying file', () => {
        const filepath = path.resolve(rootTestDirectory, 'file.js');
        createFile(filepath, true);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toEqual([filepath]);
      });

      it('directory has 1 subfolder with 1 qualifying file within', () => {
        const folderPath = createFolder('somedir', rootTestDirectory);
        const filepath = path.resolve(folderPath, 'file.js')
        createFile(filepath, true);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toEqual([filepath]);
      });
    });
    
    describe('should find 2 files ordered folder-depth first if', () => {
      it('directory has 2 qualifying files', () => {
        const filePath1 = path.resolve(rootTestDirectory, 'file-1.js');
        createFile(filePath1, true);
        const filePath2 = path.resolve(rootTestDirectory, 'file-2.js');
        createFile(filePath2, true);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toEqual([filePath1, filePath2]);
      });

      it('directory has 1 qualifying file, and 1 subfolder with 1 qualifying file within', () => {
        const filePath1 = path.resolve(rootTestDirectory, 'file-1.js');
        createFile(filePath1, true);
        const folderPath = createFolder('somedir', rootTestDirectory);
        const filePath2 = path.resolve(folderPath, 'file-2.js');
        createFile(filePath2, true);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toEqual([filePath2, filePath1]);
      });

      it('directory has 1 subfolder with 2 qualifying files within', () => {
        const folderPath = createFolder('somedir', rootTestDirectory);
        const filePath1 = path.resolve(folderPath, 'file-1.js');
        createFile(filePath1, true);
        const filePath2 = path.resolve(folderPath, 'file-2.js');
        createFile(filePath2, true);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toEqual([filePath1, filePath2]);
      });
    });

    describe('should find 3 files ordered folder-depth first if', () => {
      it('directory has 1 qualifying file, and 1 subfolder with 1 qualifying file within, and 1 subfolder with 1 qualifying file within subfolder', () => {
        const filePath1 = path.resolve(rootTestDirectory, 'file-1.js');
        createFile(filePath1, true);
        const folderPath1 = createFolder('folder', rootTestDirectory);
        const filePath2 = path.resolve(folderPath1, 'file-2.js');
        createFile(filePath2, true);
        const folderPath2 = createFolder('subfolder', folderPath1);
        const filePath3 = path.resolve(folderPath2, 'file-3.js');
        createFile(filePath3, true);
        const finder = new TodoFinder();
        finder.findFiles(rootTestDirectory);
        expect(finder.getFoundPaths()).toEqual([filePath3, filePath2, filePath1]);
      });
    });
  });

  describe('isTodoInFile', () => {
    it('should return true if "TODO" is in file contents', () => {
      const filePath = path.resolve(rootTestDirectory, 'hasTodo.js');
      createFile(filePath, true);
      const finder = new TodoFinder();
      expect(finder.isTodoInFile(filePath)).toEqual(true);
    });

    it('should return false if "TODO" is not in file contents', () => {
      const filePath = path.resolve(rootTestDirectory, 'hasNoTodo.js');
      createFile(filePath, false);
      const finder = new TodoFinder();
      expect(finder.isTodoInFile(filePath)).toEqual(false);
    });
  });
});
