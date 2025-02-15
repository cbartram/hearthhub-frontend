import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

class StaticFileHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="static", **kwargs)

def run(server_class=HTTPServer, handler_class=StaticFileHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Serving files on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()