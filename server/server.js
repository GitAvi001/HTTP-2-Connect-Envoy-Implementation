const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
    //Ensuring keys and certs for the secure connection
  key: fs.readFileSync('/certs/server.key'),
  cert: fs.readFileSync('/certs/server.crt'),
});

server.on('stream', (stream, headers) => {
  const method = headers[':method'];
  const path = headers[':path'];

  if (method === 'CONNECT') {
    console.log(`Received CONNECT request for ${path}`);

    // 200 OK status establishing the tunnel
    stream.respond({
      ':status': 200,
    });

    // Handle data within the tunnel
    stream.on('data', (chunk) => {
      const message = chunk.toString();
      console.log(`Received from client: ${message}`);

      // Respond to the client as an echo message 
      const response = `Echo from server: ${message}`;
      stream.write(response);
    });

    stream.on('end', () => {
      console.log('Stream ended by client.');
      stream.end();
    });
  } else {
    // Return 404 for non-CONNECT requests
    stream.respond({
      ':status': 404,
    });
    stream.end();
  }
});

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log('Secure HTTP/2 server is listening on port 8080');
});