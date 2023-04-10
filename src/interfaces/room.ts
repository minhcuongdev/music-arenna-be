import Player from "./player";

interface Room {
  id: string;
  name: string;
  host: string;
  players: Array<Player>;
}

export default Room;
