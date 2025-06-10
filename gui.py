import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from pathlib import Path
import threading

from s2t_batch import convert_file


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("S2T Converter")
        self.configure(bg="white")
        self.resizable(False, False)

        style = ttk.Style(self)
        style.theme_use("clam")
        style.configure(
            "Rounded.TButton",
            padding=6,
            relief="flat",
            background="#007AFF",
            foreground="white",
            borderwidth=0,
        )
        style.map(
            "Rounded.TButton",
            background=[("active", "#0051c7")],
        )

        self.input_var = tk.StringVar()
        self.output_var = tk.StringVar()
        self._build_ui()

    def _build_ui(self):
        padding = {"padx": 5, "pady": 5}

        frame = ttk.Frame(self, padding=10)
        frame.grid()

        ttk.Label(frame, text="Input file:").grid(row=0, column=0, sticky="w", **padding)
        ttk.Entry(frame, textvariable=self.input_var, width=40).grid(row=0, column=1, **padding)
        ttk.Button(frame, text="Browse...", style="Rounded.TButton", command=self.browse_input).grid(row=0, column=2, **padding)

        ttk.Label(frame, text="Output file:").grid(row=1, column=0, sticky="w", **padding)
        ttk.Entry(frame, textvariable=self.output_var, width=40).grid(row=1, column=1, **padding)
        ttk.Button(frame, text="Browse...", style="Rounded.TButton", command=self.browse_output).grid(row=1, column=2, **padding)

        self.start_btn = ttk.Button(frame, text="Start", style="Rounded.TButton", command=self.start_conversion)
        self.start_btn.grid(row=2, column=0, columnspan=3, pady=(10, 0))

        self.status_var = tk.StringVar(value="Ready")
        ttk.Label(frame, textvariable=self.status_var).grid(row=3, column=0, columnspan=3, sticky="w", pady=(5, 0))

    def browse_input(self):
        path = filedialog.askopenfilename(
            title="Select SRT file", filetypes=[("Subtitle", "*.srt")]
        )
        if path:
            self.input_var.set(path)
            if not self.output_var.get():
                self.output_var.set(str(Path(path).with_suffix(".trad.srt")))

    def browse_output(self):
        path = filedialog.asksaveasfilename(
            title="Save As",
            defaultextension=".srt",
            filetypes=[("Subtitle", "*.srt")],
        )
        if path:
            self.output_var.set(path)

    def start_conversion(self):
        input_path = Path(self.input_var.get())
        output_path = Path(self.output_var.get())
        if not input_path.is_file():
            messagebox.showerror("Error", "Please select a valid input file")
            return
        if not output_path:
            messagebox.showerror("Error", "Please select an output file")
            return

        self.start_btn.config(state=tk.DISABLED)
        self.status_var.set("Converting...")
        threading.Thread(
            target=self._convert, args=(input_path, output_path), daemon=True
        ).start()

    def _convert(self, input_path: Path, output_path: Path):
        try:
            convert_file(input_path, output_path)
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
