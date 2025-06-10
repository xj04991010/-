import argparse
import pathlib
from opencc import OpenCC


def convert_directory(
    input_dir: pathlib.Path,
    output_dir: pathlib.Path,
    extensions: tuple[str, ...] = (".txt", ".srt"),
) -> None:
    """Convert all text-based files in *input_dir* to Traditional Chinese.

    Parameters
    ----------
    input_dir: pathlib.Path
        Folder containing the files to convert.
    output_dir: pathlib.Path
        Destination folder for converted files.
    extensions: tuple[str, ...]
        File extensions to convert. By default ``.txt`` and ``.srt`` files
        are processed.
    """

    cc = OpenCC("s2t")  # Simplified Chinese to Traditional Chinese
    output_dir.mkdir(parents=True, exist_ok=True)
    for ext in extensions:
        for path in input_dir.glob(f"*{ext}"):
            traditional = cc.convert(path.read_text(encoding="utf-8"))
            (output_dir / path.name).write_text(traditional, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Batch convert Simplified Chinese subtitle or text files to Traditional Chinese"
    )
    parser.add_argument(
        "input_dir",
        type=pathlib.Path,
        help="Directory with Simplified Chinese .txt or .srt files",
    )
    parser.add_argument(
        "output_dir",
        type=pathlib.Path,
        help="Directory to write converted files to",
    )
    args = parser.parse_args()
    convert_directory(args.input_dir, args.output_dir)


if __name__ == '__main__':
    main()
