import argparse
import pathlib
from opencc import OpenCC


def convert_directory(input_dir: pathlib.Path, output_dir: pathlib.Path) -> None:
    cc = OpenCC('s2t')  # Simplified Chinese to Traditional Chinese
    output_dir.mkdir(parents=True, exist_ok=True)
    for path in input_dir.glob('*.txt'):
        traditional = cc.convert(path.read_text(encoding='utf-8'))
        (output_dir / path.name).write_text(traditional, encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description='Batch convert Simplified Chinese text files to Traditional Chinese')
    parser.add_argument('input_dir', type=pathlib.Path, help='Directory with Simplified Chinese text files')
    parser.add_argument('output_dir', type=pathlib.Path, help='Directory to write Traditional Chinese text files to')
    args = parser.parse_args()
    convert_directory(args.input_dir, args.output_dir)


if __name__ == '__main__':
    main()
