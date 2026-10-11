
const http = require("node:http");

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("OK");
    }

    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(`
        <h1>DevOps Health Checker</h1>
        <p>Application is running successfully!</p>
        <a href="/health">Check Health</a>
      `);
    }

    res.writeHead(404);
    res.end("Not Found");
  });
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createServer().listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = { createServer };
