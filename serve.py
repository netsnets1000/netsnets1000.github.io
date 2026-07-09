"""Tiny static server for the Tellera prototype.
Threaded (handles the browser's parallel/persistent connections without hanging)
and sends no-store so edits show up immediately without cache-busting."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 4321), Handler).serve_forever()
