const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    buys: {
      type: Array,
      default: []
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: []
    },
    price: {
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);