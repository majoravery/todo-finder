import * as fs from 'fs';
import * as path from 'path';

const REGEX_TODO = /"TODO"/;
const REGEX_IGNORE_DOTFILES_JSON = /(^\.\S*)|(\S*\.json$)/;

const IGNORE_PATHS = [
  'dist',
  'node_modules',
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
    const foundFilePaths: string[] = [];

    for (const item of directoryContents) {
      if (IGNORE_PATHS.includes(item) || REGEX_IGNORE_DOTFILES_JSON.test(item)) {
        continue;
      }

      const itemPath = path.resolve(directory, item);
      if (fs.lstatSync(itemPath).isFile()) {
        // Push item into hold array to add to foundPaths later, check folders first
        if (this.isTodoInFile(itemPath)) {
          foundFilePaths.push(itemPath);
        }
      } else if (fs.lstatSync(itemPath).isDirectory()) {
        this.findFiles(itemPath);
      }
    }

    this.foundPaths = this.foundPaths.concat(foundFilePaths);
  }

  public isTodoInFile(filepath: string): boolean {
    const content = fs.readFileSync(filepath, 'ascii');
    return REGEX_TODO.test(content);
  }
}
