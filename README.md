# Simplified to Traditional Chinese Batch Converter

This repository contains a simple Python script to batch convert subtitle or text files from simplified Chinese to traditional Chinese using [OpenCC](https://github.com/BYVoid/OpenCC).

## Requirements

- Python 3
- `opencc-python-reimplemented` package

Install dependencies with:

```bash
pip install opencc-python-reimplemented
```

## Usage

Prepare a directory with `.txt` or `.srt` files written in simplified Chinese. Run the script with the input and output directories:

```bash
python s2t_batch.py INPUT_DIR OUTPUT_DIR
```

Converted files will be written to `OUTPUT_DIR` with the same file names. Both text and subtitle files are supported by default.

## Graphical Interface

A minimal GUI is provided in `gui.py` for those who prefer not to use the
command line. Launch it with:

```bash
python gui.py
```

Use the dialog buttons to pick the input and output folders and start the
conversion.

## Building an executable

To distribute the converter to computers without Python installed, you can
create a standalone executable using
[PyInstaller](https://pyinstaller.org/):

```bash
pyinstaller --onefile gui.py
```

The resulting binary will be placed in the `dist` directory. On Windows it will
be `gui.exe`.
