const mongoose = require('mongoose');

// 建立 Schema
const followSchema = new mongoose.Schema(
  {
    // 設計稿 4.追蹤名單
    editor: { // 自己
      type: mongoose.Schema.ObjectId,
      ref: "user",
      select: false
    },
    following: { // 別人
      type: mongoose.Schema.ObjectId,
      ref: "user"
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    logicDeleteFlag: {
      type: Boolean,
      default: false,
      select: false,
    }
  },
  {
    versionKey: false
  }
);

// 建立 Model
const Follow = mongoose.model('follow', followSchema);

module.exports = Follow;