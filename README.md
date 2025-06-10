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

`gui.py` provides a small interface with rounded buttons reminiscent of a mobile
app. It converts one `.srt` file at a time. Launch it with:

```bash
python gui.py
```

Use the dialog buttons to choose the subtitle file and where to save the
converted version.

## Building an executable

To distribute the converter to computers without Python installed, you can
create a standalone executable using
[PyInstaller](https://pyinstaller.org/):

```bash
pyinstaller --onefile gui.py
```

The resulting binary will be placed in the `dist` directory. On Windows it will
be `gui.exe`.
