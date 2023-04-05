import { Server } from "socket.io";

let users: {
  userId: string;
  socketId: string;
}[] = [];

const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

const Socket = () => {
  const io = new Server(8900, {
    cors: {},
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("disconnect", () => {
      console.log("a user disconnect!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

export default Socket;
