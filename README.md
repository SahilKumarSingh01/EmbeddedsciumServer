# EmbeddedsciumServer
A lightweight WebSocket-based system where an ESP32 acts as a minimal client and offloads all heavy tasks to a Node.js server deployed on Render. The ESP32 only maintains a persistent connection and forwards simple requests, while the server handles computation, API calls, and responses.
