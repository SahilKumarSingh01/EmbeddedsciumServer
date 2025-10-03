import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });
console.log(`[Proxy] WebSocket server running on port ${PORT}`);

wss.on('connection', (clientWs, req) => {
  // Construct the full upstream URL dynamically from client request
  const protocol = 'wss://';
  const host = 'api.deepgram.com';
  const pathAndQuery = req.url; // includes path + query string exactly as client sent
  const upstreamUrl = protocol + host + pathAndQuery;

  // Forward the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    clientWs.close(4001, 'Missing Authorization header');
    console.log('[Proxy] Missing Authorization header');
    return;
  }

  const upstream = new WebSocket(upstreamUrl, { headers: { Authorization: authHeader } });

  upstream.on('open', () => {
    console.log(`[Proxy] Connected upstream: ${upstreamUrl} ✅`);
    clientWs.send(JSON.stringify({ message: `Connected to upstream` }));
  });

  // Client → Upstream
  clientWs.on('message', (msg) => {
    if (upstream.readyState === WebSocket.OPEN) upstream.send(msg);
  });

  // Upstream → Client
  upstream.on('message', (msg) => {
    if (clientWs.readyState === WebSocket.OPEN) clientWs.send(msg);
  });

  // Handle disconnects
  clientWs.on('close', () => upstream.close());
  upstream.on('close', () => clientWs.close());

  upstream.on('error', (err) => {
    console.error('[Proxy] Upstream error:', err.message);
    clientWs.close(1011, 'Upstream connection failed');
  });
});
