import { Server, Socket as SocketIo } from "socket.io";
import { Server as ServerHTTP } from "http";
import Room from "../interfaces/room";
import { v4 as uuidv4 } from "uuid";
import Player from "../interfaces/player";

let rooms: Array<Room> = [];

const getRoomById = (id: string) => {
  const getedRooms = rooms.filter((room) => room.id === id);
  if (getedRooms.length === 0) return null;
  return getedRooms[0];
};

const leavedRoom = (roomId: string, socket: SocketIo, io: Server) => {
  const room = getRoomById(roomId);
  if (room === null) return;

  socket.leave(room.id);
  socket.leave(socket.id);

  room.players = room.players.filter((player) => player.id !== socket.id);
  if (room.players.length === 0) {
    rooms = rooms.filter((room) => room.id !== roomId);
  } else if (!room.players.some((player) => player.name === room.host)) {
    room.host = room.players[0].name;
  }

  io.in(room.id).emit("getPlayersInRoom", room.players);

  io.emit("getRooms", rooms);
};

const Socket = (server: ServerHTTP) => {
  const io = new Server(server, {
    cors: {},
  });

  io.on("connection", (socket) => {
    console.log("a user connected ", socket.id);

    socket.emit("getRooms", rooms);

    socket.on("createRoom", (name, host) => {
      const room: Room = {
        id: uuidv4(),
        name: name,
        host: host,
        players: [],
      };

      rooms.push(room);

      socket.emit("getCreatedRoom", room);
    });

    socket.on("joinRoom", (roomId, name) => {
      console.log(roomId, name);
      const room = getRoomById(roomId);

      if (room === null) return;

      socket.join(room.id);

      const player: Player = {
        id: socket.id,
        name: name ? name : room.host,
        score: 0,
      };

      room.players.push(player);

      io.to(room.id).emit("getPlayersInRoom", room.players);

      io.emit("getRooms", rooms);
    });

    socket.on("leavedRoom", (roomId) => {
      leavedRoom(roomId, socket, io);
    });

    socket.on("getExistRooms", () => {
      io.emit("getRooms", rooms);
    });

    socket.on("disconnect", () => {
      console.log(socket.id);
      const room = rooms.filter((room) =>
        room.players.some((player) => player.id === socket.id)
      );
      if (room.length !== 0) {
        leavedRoom(room[0].id, socket, io);
      }
      console.log("a user disconnect!");
    });
  });
};

export default Socket;
