import TodoFinder from './todoFinder';

export default (function main(): void {
  const finder = new TodoFinder();
  finder.findFiles();
  finder.listFoundPaths();
})();