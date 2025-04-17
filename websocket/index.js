const { Server } = require("socket.io");

let _io = null;

const initServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    transports: ["websocket", "polling"],
  });

  _io = io;

  return io;
};

const initConnection = () => {
  if (!_io) {
    throw new Error("Socket.io not initialized");
  }

  _io.on("connection", (socket) => {
    const userId = socket.request._query.userId;
    console.log(`[websocket]: user connected! userid: `, userId);

    if (userId) {
      socket.join(userId);
    }

    socket.on("disconnect", () => {
      console.log("[websocket]: user disconnected! userid: ", userId);
    });
  });
};

const sendMessage = (userId, message) => {
  if (!_io) {
    throw new Error("[websocket]: Socket.io not initialized");
  }

  return _io.to(userId).emit("notification", message);
};

module.exports = { initServer, initConnection, sendMessage };
