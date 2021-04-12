# Todo Finder

Traverses the current directory, looks for `"TODO"` in files and prints the paths

## How to use

```bash
npm run build
node dist/cli.js
```

## Assumptions

1. No error or warning messages are needed
1. Folders are always traversed first, even though `fs` lists directory contents alphabetically

## Notes

I used the pkg package as a tool to compile the files into a cross-platform compatible executable. The latest node version it [works with is 14.16.1](https://github.com/vercel/pkg-fetch/blob/master/patches/patches.json), so I've added a `.nvmrc` to enforce that version.