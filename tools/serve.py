# Dev server for 1066gram: serves app/ with caching disabled so edits show up immediately.
# Also accepts POST /__save?name=og.png so a page can save a rendered image into app/ (dev only).
import http.server, functools, sys, os, urllib.parse
ALLOWED = {'og.png'}
class Dev(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def do_POST(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        name = (q.get('name') or [''])[0]
        if not self.path.startswith('/__save') or name not in ALLOWED:
            self.send_response(403); self.end_headers(); return
        data = self.rfile.read(int(self.headers['Content-Length']))
        with open(os.path.join('app', name), 'wb') as f: f.write(data)
        self.send_response(204); self.end_headers()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8066
http.server.ThreadingHTTPServer(('', port), functools.partial(Dev, directory='app')).serve_forever()
