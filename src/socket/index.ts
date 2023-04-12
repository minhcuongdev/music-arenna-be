import { Server, Socket as SocketIo } from "socket.io";
import { Server as ServerHTTP } from "http";
import Room from "../interfaces/room";
import { v4 as uuidv4 } from "uuid";
import Player from "../interfaces/player";
import QuestionService from "../services/question.service";

let rooms: Array<Room> = [];

let tempPlayersSelectedInRoom: Array<{
  roomId: string;
  userSelected: string[];
}> = [];

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
    tempPlayersSelectedInRoom = tempPlayersSelectedInRoom.filter(
      (room) => room.roomId !== roomId
    );
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
      const room = getRoomById(roomId);

      if (room === null || name === "") return;

      socket.join(room.id);

      const player: Player = {
        id: socket.id,
        name: name ? name : room.host,
        avatar: 0,
        score: 0,
      };

      room.players.push(player);

      io.to(room.id).emit("getPlayersInRoom", room.players);
      io.to(room.id).emit("getRoomName", room.name, room.host);
      io.emit("getRooms", rooms);
    });

    socket.on("leavedRoom", (roomId) => {
      leavedRoom(roomId, socket, io);
    });

    socket.on("getExistRooms", () => {
      io.emit("getRooms", rooms);
    });

    socket.on("changeAvatar", (avatar: number, roomId: string) => {
      const room = getRoomById(roomId);
      if (room === null) return;

      const users = room.players.filter((player) => player.id === socket.id);
      if (users.length === 0) return;

      const user = users[0];
      user.avatar = avatar;

      io.to(room.id).emit("getPlayersInRoom", room.players);
    });

    socket.on("start", async (roomId: string) => {
      try {
        const questions = await QuestionService.getQuestions();
        io.to(roomId).emit("getQuestions", questions);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("timeout", (roomId, timeout) => {
      if (timeout) {
        io.to(roomId).emit("nextQuestion", true);
        io.to(roomId).emit("selected", "", false, true);
      }
    });

    socket.on("select", (roomId) => {
      io.to(roomId).emit("selected", socket.id, true, false);
      if (tempPlayersSelectedInRoom.length === 0) {
        const tempRoom = {
          roomId: roomId,
          userSelected: [socket.id],
        };
        tempPlayersSelectedInRoom.push(tempRoom);
      } else {
        const tempRooms = tempPlayersSelectedInRoom.filter(
          (room) => room.roomId === roomId
        );
        if (tempRooms.length === 0) return;
        const tempRoom = tempRooms[0];
        tempRoom.userSelected.push(socket.id);
        const room = getRoomById(roomId);
        if (tempRoom.userSelected.length === room?.players.length) {
          tempRoom.userSelected = [];
          io.to(roomId).emit("nextQuestion", true);
          setTimeout(() => {
            io.to(roomId).emit("selected", "", false, true);
          }, 1000);
        }
      }
    });

    socket.on("score", (roomId, score) => {
      const room = getRoomById(roomId);
      if (room === null) return;

      const players = room.players.filter((player) => player.id === socket.id);
      if (players.length === 0) return;

      players[0].score = players[0].score + score;

      io.to(room.id).emit("getPlayersInRoom", room.players);
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
