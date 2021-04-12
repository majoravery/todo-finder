# Todo Finder

Traverses the current directory, looks for `"TODO"` in files and prints the paths

## How to use

### Setup

```bash
npm i
npm run build
```

### Run locally

```bash
npm run start
```

### Run elsewhere

```bash
npm run compile
```

Depending on your environment, drag the corresponding executable out of `bin/` and place it in the folder where you want it to be run and execute it in your terminal.

## Assumptions

1. No error or warning messages are needed
1. Folders are always traversed first, even though `fs` lists directory contents alphabetically

## Notes

I used the pkg package as a tool to compile the files into cross-platform compatible executables. The latest node version it [works with is 14.16.1](https://github.com/vercel/pkg-fetch/blob/master/patches/patches.json), so I've added a `.nvmrc` to enforce that version.