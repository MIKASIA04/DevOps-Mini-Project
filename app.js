
const http = require("node:http");

function createServer() {
  return http.createServer((req, res) => {
    const pathname = new URL(
      req.url,
      "http://localhost"
    ).pathname;

    // Health endpoint used by automated tests and Docker.
    if (req.method === "GET" && pathname === "/health") {
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      });
      return res.end("OK");
    }

    // Main monitoring dashboard.
    if (req.method === "GET" && pathname === "/") {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      });

      return res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0b1020">
  <title>DevOps Health Checker</title>

  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: #0b1020;
      color: #e8edf8;
      font-family: "Segoe UI", Arial, sans-serif;
    }

    .topbar {
      padding: 20px 7%;
      border-bottom: 1px solid #222b40;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 17px;
      font-weight: 700;
    }

    .logo {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      background: #172a48;
      border: 1px solid #31517d;
      border-radius: 12px;
      color: #7db5ff;
      font-size: 24px;
    }

    .tag {
      color: #91a0ba;
      border: 1px solid #303b52;
      border-radius: 20px;
      padding: 8px 12px;
      font-size: 11px;
      letter-spacing: 1px;
    }

    main {
      width: min(1050px, 86%);
      margin: 52px auto;
    }

    .eyebrow {
      color: #79aaff;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 12px;
      font-weight: 700;
    }

    h1 {
      font-size: clamp(32px, 5vw, 48px);
      letter-spacing: -1.5px;
      margin: 14px 0;
    }

    .intro {
      color: #9ba9c1;
      max-width: 650px;
      line-height: 1.8;
      font-size: 15px;
    }

    .status-card {
      margin-top: 32px;
      padding: 26px;
      border: 1px solid #293750;
      border-radius: 18px;
      background: linear-gradient(120deg, #131e33, #111827);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 22px;
      flex-wrap: wrap;
    }

    .status-label {
      color: #9ba9c1;
      font-size: 12px;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .status-line {
      display: flex;
      align-items: center;
      gap: 11px;
      font-size: 24px;
      font-weight: 700;
    }

    .dot {
      width: 11px;
      height: 11px;
      background: #f5bd4f;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .dot.good {
      background: #35d399;
      box-shadow: 0 0 14px #35d39966;
    }

    .dot.bad {
      background: #fb7185;
      box-shadow: 0 0 14px #fb718566;
    }

    button {
      background: #79aaff;
      color: #071222;
      border: none;
      padding: 14px 19px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
      transition: background .2s, transform .2s;
    }

    button:hover {
      background: #a0c4ff;
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: .65;
      cursor: wait;
      transform: none;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 20px;
    }

    .card {
      background: #111a2c;
      border: 1px solid #253149;
      border-radius: 15px;
      padding: 22px;
      min-width: 0;
    }

    .card-label {
      color: #91a0ba;
      font-size: 13px;
    }

    .card-value {
      margin-top: 15px;
      font-size: 20px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .card-note {
      margin-top: 8px;
      color: #7f8da7;
      font-size: 12px;
      line-height: 1.7;
    }

    .section-title {
      margin: 36px 0 15px;
      font-size: 19px;
    }

    .service {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 18px 0;
      border-bottom: 1px solid #253149;
    }

    .service:last-child {
      border-bottom: none;
    }

    .service-name {
      font-weight: 600;
    }

    .service-desc {
      color: #8998b2;
      font-size: 12px;
      margin-top: 5px;
      line-height: 1.6;
    }

    .pill {
      color: #65e6b3;
      background: #123529;
      border-radius: 20px;
      padding: 7px 10px;
      font-size: 11px;
      white-space: nowrap;
    }

    .pill.pending {
      color: #f7cb72;
      background: #3b2d17;
    }

    .pill.bad {
      color: #ff9aaa;
      background: #421e2b;
    }

    .notice {
      margin-top: 18px;
      padding: 14px 16px;
      background: #111a2c;
      border: 1px solid #253149;
      border-radius: 12px;
      color: #91a0ba;
      font-size: 12px;
      line-height: 1.8;
    }

    footer {
      border-top: 1px solid #222b40;
      margin-top: 45px;
      padding: 24px 7%;
      color: #71809b;
      font-size: 12px;
      line-height: 1.8;
    }

    @media (max-width: 700px) {
      .grid {
        grid-template-columns: 1fr;
      }

      main {
        margin-top: 36px;
      }

      .topbar {
        padding: 16px 6%;
      }

      .tag {
        display: none;
      }

      .status-card {
        padding: 20px;
      }

      .status-card button {
        width: 100%;
      }
    }
  </style>
</head>

<body>
  <header class="topbar">
    <div class="brand">
      <div class="logo">&#9881;</div>
      <span>DevOps Health Checker</span>
    </div>
    <div class="tag">MONITORING CONSOLE · LOCAL</div>
  </header>

  <main>
    <div class="eyebrow">Application observability</div>
    <h1>Your service, at a glance.</h1>

    <p class="intro">
      Monitor application availability and verify the health endpoint.
      Automated tests, Docker container health, and CI/CD validation
      are handled by your GitHub Actions pipeline.
    </p>

    <section class="status-card">
      <div>
        <div class="status-label">LOCAL APPLICATION STATUS</div>

        <div class="status-line" aria-live="polite">
          <span id="statusDot" class="dot"></span>
          <span id="statusText">Waiting for health check...</span>
        </div>

        <div class="card-note" id="statusMessage">
          Click the button to verify the application.
        </div>
      </div>

      <button id="checkButton" type="button">
        Run health check &#8599;
      </button>
    </section>

    <section class="grid">
      <div class="card">
        <div class="card-label">Service</div>
        <div class="card-value">Node.js HTTP</div>
        <div class="card-note">Application runtime</div>
      </div>

      <div class="card">
        <div class="card-label">Application port</div>
        <div class="card-value">3000</div>
        <div class="card-note">Local development server</div>
      </div>

      <div class="card">
        <div class="card-label">Health endpoint</div>
        <div class="card-value">/health</div>
        <div class="card-note">Expected response: HTTP 200 · OK</div>
      </div>
    </section>

    <h2 class="section-title">Service overview</h2>

    <section class="card">
      <div class="service">
        <div>
          <div class="service-name">Web application</div>
          <div class="service-desc">Homepage and HTTP server</div>
        </div>
        <span class="pill pending" id="webPill">Not checked</span>
      </div>

      <div class="service">
        <div>
          <div class="service-name">Health endpoint</div>
          <div class="service-desc">GET /health</div>
        </div>
        <span class="pill pending" id="healthPill">Not checked</span>
      </div>

      <div class="service">
        <div>
          <div class="service-name">Docker health monitoring</div>
          <div class="service-desc">
            Docker container health is verified in GitHub Actions.
          </div>
        </div>
        <span class="pill">Configured in CI/CD</span>
      </div>

      <div class="service">
        <div>
          <div class="service-name">Automated test suite</div>
          <div class="service-desc">
            Test results are available in GitHub Actions logs.
          </div>
        </div>
        <span class="pill">Configured in CI/CD</span>
      </div>
    </section>

    <div class="notice" id="lastChecked" aria-live="polite">
      No health check has been performed yet.
    </div>
  </main>

  <footer>
    DEVOPS HEALTH CHECKER · CI/CD DEMONSTRATION<br>
    Local status reflects this application only.
    Docker and pipeline statuses are not fetched live from GitHub.
  </footer>

  <script>
    const button = document.getElementById("checkButton");

    async function checkHealth() {
      const statusText = document.getElementById("statusText");
      const statusMessage = document.getElementById("statusMessage");
      const statusDot = document.getElementById("statusDot");
      const healthPill = document.getElementById("healthPill");
      const webPill = document.getElementById("webPill");
      const lastChecked = document.getElementById("lastChecked");

      button.disabled = true;
      button.textContent = "Checking...";
      statusText.textContent = "Checking service...";
      statusMessage.textContent = "Sending request to /health";
      statusDot.className = "dot";

      try {
        const response = await fetch("/health", {
          method: "GET",
          cache: "no-store"
        });

        const result = await response.text();

        if (!response.ok || result.trim() !== "OK") {
          throw new Error(
            "Unexpected response: HTTP " + response.status
          );
        }

        statusText.textContent = "Operational";
        statusMessage.textContent =
          "Health endpoint returned HTTP 200 and OK.";
        statusDot.className = "dot good";

        healthPill.textContent = "Healthy";
        healthPill.className = "pill";

        webPill.textContent = "Reachable";
        webPill.className = "pill";

        lastChecked.textContent =
          "SUCCESS · Last checked at " +
          new Date().toLocaleTimeString() +
          " · Endpoint response: OK";

      } catch (error) {
        statusText.textContent = "Unavailable";
        statusMessage.textContent =
          "Health check failed: " + error.message;
        statusDot.className = "dot bad";

        healthPill.textContent = "Failed";
        healthPill.className = "pill bad";

        webPill.textContent = "Unavailable";
        webPill.className = "pill bad";

        lastChecked.textContent =
          "FAILED · Last attempted at " +
          new Date().toLocaleTimeString() +
          " · Check that the server is running.";

      } finally {
        button.disabled = false;
        button.textContent = "Run health check \u2197";
      }
    }

    button.addEventListener("click", checkHealth);

    // Check once when the dashboard first loads.
    checkHealth();
  </script>
</body>
</html>`);
    }

    // Any other route returns HTTP 404.
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("Not Found");
  });
}

if (require.main === module) {
  const port = process.env.PORT || 3000;

  createServer().listen(port, "0.0.0.0", () => {
    console.log("Server running on port " + port);
  });
}

module.exports = { createServer };
