import pathlib
import tkinter as tk
from tkinter import filedialog, messagebox

try:
    from tkinterdnd2 import TkinterDnD, DND_FILES
except ImportError:  # tkinterdnd2 not installed
    TkinterDnD = None
    DND_FILES = None

from opencc import OpenCC


def convert_srt(path: pathlib.Path) -> pathlib.Path:
    """Convert a single SRT file to Traditional Chinese.

    Returns the path to the converted file.
    """
    cc = OpenCC("s2t")
    traditional = cc.convert(path.read_text(encoding="utf-8"))
    output_path = path.with_name(path.stem + "_trad.srt")
    output_path.write_text(traditional, encoding="utf-8")
    return output_path


def handle_file(path: str):
    p = pathlib.Path(path)
    if p.suffix.lower() != ".srt":
        messagebox.showerror("Error", "Please provide an .srt file")
        return
    try:
        out = convert_srt(p)
    except Exception as e:
        messagebox.showerror("Conversion failed", str(e))
        return
    messagebox.showinfo("Done", f"Converted file saved to {out}")


def main():
    if TkinterDnD:
        root = TkinterDnD.Tk()
    else:
        root = tk.Tk()
    root.title("SRT Simplified->Traditional Converter")
    root.geometry("400x200")

    label = tk.Label(root, text="Drag SRT file here or click to browse", relief="ridge", width=40, height=5)
    label.pack(expand=True, padx=20, pady=20, fill="both")

    def browse():
        path = filedialog.askopenfilename(filetypes=[("SRT files", "*.srt")])
        if path:
            handle_file(path)

    label.bind("<Button-1>", lambda _: browse())

    if TkinterDnD and DND_FILES:
        label.drop_target_register(DND_FILES)
        label.dnd_bind("<<Drop>>", lambda e: handle_file(e.data))

    root.mainloop()


if __name__ == "__main__":
    main()
