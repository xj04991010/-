# Simplified to Traditional Chinese Batch Converter

This repository contains a simple Python script to batch convert text files from simplified Chinese to traditional Chinese using [OpenCC](https://github.com/BYVoid/OpenCC).

## Requirements

- Python 3
- `opencc-python-reimplemented` package

Install dependencies with:

```bash
pip install opencc-python-reimplemented
```

## Usage

Prepare a directory with `.txt` files written in simplified Chinese. Run the script with the input and output directories:

```bash
python s2t_batch.py INPUT_DIR OUTPUT_DIR
```

Converted files will be written to `OUTPUT_DIR` with the same file names.
