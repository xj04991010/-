import tkinter as tk
from tkinter import filedialog, messagebox
from pathlib import Path
import threading

from s2t_batch import convert_directory


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("S2T Batch Converter")
        self.resizable(False, False)

        self.input_var = tk.StringVar()
        self.output_var = tk.StringVar()
        self._build_ui()

    def _build_ui(self):
        padding = {'padx': 5, 'pady': 5}

        tk.Label(self, text="Input folder:").grid(row=0, column=0, sticky="w", **padding)
        tk.Entry(self, textvariable=self.input_var, width=40).grid(row=0, column=1, **padding)
        tk.Button(self, text="Browse...", command=self.browse_input).grid(row=0, column=2, **padding)

        tk.Label(self, text="Output folder:").grid(row=1, column=0, sticky="w", **padding)
        tk.Entry(self, textvariable=self.output_var, width=40).grid(row=1, column=1, **padding)
        tk.Button(self, text="Browse...", command=self.browse_output).grid(row=1, column=2, **padding)

        self.start_btn = tk.Button(self, text="Start", command=self.start_conversion)
        self.start_btn.grid(row=2, column=0, columnspan=3, **padding)

        self.status_var = tk.StringVar(value="Ready")
        tk.Label(self, textvariable=self.status_var).grid(row=3, column=0, columnspan=3, sticky="w", **padding)

    def browse_input(self):
        path = filedialog.askdirectory(title="Select input directory")
        if path:
            self.input_var.set(path)

    def browse_output(self):
        path = filedialog.askdirectory(title="Select output directory")
        if path:
            self.output_var.set(path)

    def start_conversion(self):
        input_path = Path(self.input_var.get())
        output_path = Path(self.output_var.get())
        if not input_path.is_dir():
            messagebox.showerror("Error", "Please select a valid input directory")
            return
        if not output_path:
            messagebox.showerror("Error", "Please select an output directory")
            return

        self.start_btn.config(state=tk.DISABLED)
        self.status_var.set("Converting...")
        threading.Thread(target=self._convert, args=(input_path, output_path), daemon=True).start()

    def _convert(self, input_path: Path, output_path: Path):
        try:
            convert_directory(input_path, output_path)
            self.status_var.set("Done")
            messagebox.showinfo("Finished", "Conversion completed")
        except Exception as exc:
            self.status_var.set("Error")
            messagebox.showerror("Error", str(exc))
        finally:
            self.start_btn.config(state=tk.NORMAL)


def main():
    app = App()
    app.mainloop()


if __name__ == "__main__":
    main()
