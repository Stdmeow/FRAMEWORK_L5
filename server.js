const Framework = require('./Framework');
const app = new Framework();

app.use((req, res, next) => {
  console.log(`📥 Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/hello', (req, res) => res.send('Hello, world!'));
app.get('/data', (req, res) => res.json({ message: 'GET request to /data' }));
app.post('/data', (req, res) => res.json({ message: 'POST received', body: req.body }));

app.get('/update', (req, res) => res.send('GET request to /update (use PUT to modify)'));
app.put('/update', (req, res) => res.json({ message: 'PUT received', body: req.body }));

app.get('/modify', (req, res) => res.send('GET request to /modify (use PATCH to modify)'));
app.patch('/modify', (req, res) => res.json({ message: 'PATCH received', body: req.body }));

app.get('/delete', (req, res) => res.send('GET request to /delete (use DELETE to remove)'));
app.delete('/delete', (req, res) => res.send('DELETE request received'));

app.get('/favicon.ico', (req, res) => res.status(204).send(''));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`📡 Server running at http://localhost:${PORT}\n`);
  console.log('🌍 Available routes:');
  console.log(`🟢 GET    → http://localhost:${PORT}/hello`);
  console.log(`🟡 POST   → http://localhost:${PORT}/data`);
  console.log(`🔵 PUT    → http://localhost:${PORT}/update`);
  console.log(`🟠 PATCH  → http://localhost:${PORT}/modify`);
  console.log(`🔴 DELETE → http://localhost:${PORT}/delete`);
});
