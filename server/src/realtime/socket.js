const { Server } = require("socket.io");
const { setIo } = require("./socketState");

function createSocketServer(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    socket.on("queue:join", ({ slotId }) => {
      if (!slotId) {
        return;
      }
      socket.join(`queue:${slotId}`);
    });

    socket.on("queue:leave", ({ slotId }) => {
      if (!slotId) {
        return;
      }
      socket.leave(`queue:${slotId}`);
    });
  });

  setIo(io);

  return io;
}

module.exports = { createSocketServer };
