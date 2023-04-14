import { Request, Response } from "express";
import { HttpStatusCode } from "../utils/constants";
import PlayListService from "../services/playlist.service";

export const addPlayList = async (
  req: Request<{}, {}, { id: string; type?: string }>,
  res: Response
) => {
  try {
    const newPlayList = await PlayListService.addPlayList(req.body.id);
    return res.status(HttpStatusCode.CREATED).json(newPlayList);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json(error);
  }
};

export const getPlayLists = async (
  req: Request<{}, {}, {}, { type: string }>,
  res: Response
) => {
  try {
    const playlists = await PlayListService.getPlayLists(req.query.type);
    return res.status(HttpStatusCode.OK).json(playlists);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json(error);
  }
};
