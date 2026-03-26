const http = require("http");

const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const { createSocketServer } = require("./realtime/socket");

async function bootstrap() {
  await connectDb();

  const httpServer = http.createServer(app);
  createSocketServer(httpServer, env.clientOrigin);

  httpServer.listen(env.port, () => {
    console.log(`[server] Running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("[server] Failed to start:", error);
  process.exit(1);
});
