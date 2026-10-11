
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("../app");

async function withServer(callback) {
  const server = createServer();

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  try {
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    await callback(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

test("health endpoint returns 200 and OK", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.equal(await response.text(), "OK");
  });
});

test("homepage returns 200 and application title", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /DevOps Health Checker/);
  });
});

test("invalid route returns 404", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/invalid-route`);

    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not Found");
  });
});
