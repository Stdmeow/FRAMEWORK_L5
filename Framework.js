const http = require('http');
const url = require('url');
const EventEmitter = require('events');

class MyFramework extends EventEmitter {
  constructor() {
    super();
    this.routes = { GET: {}, POST: {}, PUT: {}, PATCH: {}, DELETE: {} };
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  register(method, path, handler) {
    console.log(`✅ Route registered: ${method} ${path}`);
    this.routes[method][path] = handler;
  }

  get(path, handler) { this.register('GET', path, handler); }
  post(path, handler) { this.register('POST', path, handler); }
  put(path, handler) { this.register('PUT', path, handler); }
  patch(path, handler) { this.register('PATCH', path, handler); }
  delete(path, handler) { this.register('DELETE', path, handler); }

  handleRequest(req, res) {
    const method = req.method;
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    req.query = parsedUrl.query;
    req.body = '';

    res.send = (body) => { res.setHeader('Content-Type', 'text/plain'); res.end(body); };
    res.json = (body) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
    res.status = (code) => { res.statusCode = code; return res; };

    console.log(`📥 Incoming request: ${method} ${pathname}`);

    if (!this.routes[method] || !this.routes[method][pathname]) {
      console.log(`❌ 404 Not Found: ${method} ${pathname}`);
      return res.status(404).send('Not Found');
    }

    if (method === 'GET') {
      return this.runMiddlewares(req, res, () => this.routes[method][pathname](req, res));
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = body;
      }
      this.runMiddlewares(req, res, () => this.routes[method][pathname](req, res));
    });
  }

  runMiddlewares(req, res, finalHandler, index = 0) {
    if (index < this.middlewares.length) {
      this.middlewares[index](req, res, () => this.runMiddlewares(req, res, finalHandler, index + 1));
    } else {
      finalHandler();
    }
  }

  listen(port, handler) {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    server.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}\n`);
      if (handler) handler();
    });
  }
}

module.exports = MyFramework;
