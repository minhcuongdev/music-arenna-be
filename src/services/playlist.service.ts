import PlayListModel from "../models/playlist.model";

const PlayListService = {
  addPlayList: async (id: string, type?: string) => {
    const newPlayList = new PlayListModel({
      id: id,
      type: type,
    });

    const savePlayList = await newPlayList.save();
    return savePlayList;
  },
  getPlayLists: async (type?: string) => {
    if (type) {
      return await PlayListModel.find({ type: type }).exec();
    }

    return await PlayListModel.find({}).exec();
  },
};

export default PlayListService;
