// server.js
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
  });

  ws.send("Hello from server");
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
