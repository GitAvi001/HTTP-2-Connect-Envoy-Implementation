const net = require('net');

// Builds the TCP connection between client and envoy proxy
const client = net.createConnection({ port: 10000 }, () => {
  console.log('Connected to Envoy.');

  // Send messages to the server through HTTP/2 CONNECT tunnel
  let counter = 1;
  const interval = setInterval(() => {
    const message = `Message ${counter} from client!`;
    client.write(message);
    counter += 1;
  }, 1000);

  // Close the connection
  setTimeout(() => {
    clearInterval(interval);
    client.end();
  }, 10000);
});

client.on('data', (data) => {
  console.log(`Received from server: ${data.toString()}`);
});

client.on('end', () => {
  console.log('Disconnected from server.');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});