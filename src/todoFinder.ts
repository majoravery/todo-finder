import * as fs from 'fs';
import * as path from 'path';

const REGEX_TODO = /"TODO"/;

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
    const filesInDirectory: string[] = [];

    for (const item of directoryContents) {
      if (IGNORE_PATHS.includes(item)) {
        continue;
      }

      const itemPath = path.resolve(directory, item);
      if (fs.lstatSync(itemPath).isFile()) {
        // Push item into hold array to check for later, check folders first
        filesInDirectory.push(itemPath);
      } else if (fs.lstatSync(itemPath).isDirectory()) {
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
