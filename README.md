# Filtereact: now with a real unix filter!!!
![license](https://img.shields.io/badge/license-MIT-brightgreen)
![version](https://img.shields.io/badge/npm-v0.1.7-blue)
![tests passing](https://img.shields.io/badge/build-passing-success)

Filtereact is a fork of a vscode extension that gets rid of the vscode extension part.

Please note that this is in the very early days of development and extremely unstable. Use at your own risk.

## Filtering

filtereact comes with a executable that takes in filepaths and spits out json. Each line of json will have the name of the component, its props, an id, the id of the component that called that component, and an array of file paths linking back to the first filepath you passed in. You can ask for more information with the `-k` flag.

Filenames can be passed in either as a positional argument, or streamed in via stdin, eg
```bash
find . | grep .tsx | filtereact
```

Examples of the program in action are in the makefile.
