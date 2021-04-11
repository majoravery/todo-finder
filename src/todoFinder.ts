import * as fs from 'fs';
import * as path from 'path';

const REGEX_IS_ITEM_A_FILE = /^\S*\.\S+$/;
const REGEX_TODO = /"TODO"/;

const IGNORE_PATHS = [
  'dist',
  'node_modules',
  'src',
  '.DS_Store',
  '.eslintrc.js',
  '.gitignore',
  '.npmrc',
  'jest.config.js',
  'list-todos.js',
  'list-todos.test.js',
  'package-lock.json',
  'package.json',
  'README.md',
  'tsconfig.json',
  'TodoFinder.ts',
];
 
export default class TodoFinder {
  protected foundPaths: string[] = [];

  public getFoundPaths(): string[] {
    return this.foundPaths;
  }

  public listFoundPaths(): void {
    console.log(this.getFoundPaths().join('\n'));
  }

  public findFiles(directory: string = path.resolve('./')): void {
    const directoryContents: string[] = fs.readdirSync(directory);
    const filesInDirectory: string[] = [];

    for (const item of directoryContents) {
      if (IGNORE_PATHS.includes(item)) {
        continue;
      }

      const itemPath = path.resolve(directory, item);
      if (REGEX_IS_ITEM_A_FILE.test(item)) {
        // Push item into hold array to check for later, check folders first
        filesInDirectory.push(itemPath);
      } else {
        // Item is a folder, traversing...
        this.findFiles(itemPath);
      }
    }

    for (const filepath of filesInDirectory) {
      if (this.isTodoInFile(filepath)) {
        this.foundPaths.push(filepath);
      }
    }
  }

  public isTodoInFile(filepath: string): boolean {
    const content = fs.readFileSync(filepath, 'ascii');
    return REGEX_TODO.test(content);
  }
}
