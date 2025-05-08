const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/p2pchat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  online: { type: Boolean, default: false },
});

const topicSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  hash: Buffer,
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Topic = mongoose.model("Topic", topicSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { mongoose, User, Topic, Message };
