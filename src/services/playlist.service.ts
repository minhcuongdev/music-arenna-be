import PlayListModel from "../models/playlist.model";

const PlayListService = {
  addPlayList: async (id: string) => {
    const newPlayList = new PlayListModel({
      id: id,
    });

    const savePlayList = await newPlayList.save();
    return savePlayList;
  },
  getPlayLists: async () => {
    return await PlayListModel.find();
  },
};

export default PlayListService;
