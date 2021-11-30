const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new mongoose.Schema({
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
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
  reposts: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
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
module.exports = mongoose.model("Blog", BlogSchema);
