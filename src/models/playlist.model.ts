import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayListSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    default: "popular",
  },
});

const PlayListModel = mongoose.model("PlayList", PlayListSchema);

export default PlayListModel;
