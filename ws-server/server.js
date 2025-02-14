const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Send a welcome message to the client
    ws.send(JSON.stringify({
        content: "{\"joinCode\": \"742588\", \"containerName\": \"valheim-215299779352068097\", \"containerType\": \"server\", \"operation\": \"\"}",
        discord_id: "215299779352068097",
        type: "JoinCode"
    }));

    setInterval(() => {
        console.log('sending join code')
        ws.send(JSON.stringify({
            content: "{\"joinCode\": \"742588\", \"containerName\": \"valheim-215299779352068097\", \"containerType\": \"server\", \"operation\": \"\"}",
            discord_id: "215299779352068097",
            type: "JoinCode"
        }));
    }, 10 * 1000)

    // Handle messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Echo the message back to the client
        ws.send(JSON.stringify({ type: 'Echo', content: message }));
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected');
    });
});