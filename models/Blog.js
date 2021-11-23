const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  filetype: {
    type:String,
    required:true,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
  shares: {
    type: Array,
    required: true,
  },
  parentpost: {
    type: Number,
    required: true,
  },
  originmetaurl: {
    type: String,
    required: true,
  },
  markedmetaurl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("post", PostSchema);
