import express from "express";
import { addPlayList, getPlayLists } from "../controllers/playlist.controller";

const route = express.Router();

route.get("/", getPlayLists);
route.post("/", addPlayList);

export default route;
