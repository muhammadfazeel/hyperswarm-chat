const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const { User, Topic, Message } = require("./db");

let win;
let swarm;
const peers = [];
const seenMessages = new Set();

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

let currentUser = null;
let currentTopicDoc = null;

ipcMain.on("start", async (event, { username, topicName }) => {
  currentUser = await User.findOne({ username });
  if (!currentUser) currentUser = await User.create({ username });
  currentUser.online = true;
  await currentUser.save();

  currentTopicDoc = await Topic.findOne({ name: topicName });
  if (!currentTopicDoc) {
    const hash = crypto.createHash("sha256").update(topicName).digest();
    currentTopicDoc = await Topic.create({ name: topicName, hash });
  }

  const topicHash = currentTopicDoc.hash;
  swarm = new Hyperswarm();
  swarm.join(topicHash, { lookup: true, announce: true });

  swarm.on("connection", (socket) => {
    peers.push(socket);
    socket.on("data", async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "user-status") {
          win.webContents.send("users", msg.users);
          return;
        }

        if (seenMessages.has(msg.id)) return;
        seenMessages.add(msg.id);

        const sender = await User.findOne({ username: msg.name });
        await Message.create({
          text: msg.text,
          sender: sender._id,
          topic: currentTopicDoc._id,
        });

        win.webContents.send("message", data.toString());
      } catch (err) {
        console.error("Invalid message:", err.message);
      }
    });
  });

  const history = await Message.find({ topic: currentTopicDoc._id })
    .populate("sender", "username")
    .sort({ timestamp: 1 })
    .lean();

  const users = await User.find({}, "username online").lean();

  win.webContents.send("history", history);
  win.webContents.send("users", users);

  const statusPayload = JSON.stringify({
    type: "user-status",
    users,
  });
  for (const peer of peers) peer.write(statusPayload);

  event.returnValue = { success: true };
});

ipcMain.on("message", async (event, payload) => {
  try {
    const msg = JSON.parse(payload);
    if (seenMessages.has(msg.id)) return;
    seenMessages.add(msg.id);

    const sender = await User.findOne({ username: msg.name });
    const topic = await Topic.findOne({ name: msg.topic });
    await Message.create({
      text: msg.text,
      sender: sender._id,
      topic: topic._id,
    });

    for (const peer of peers) peer.write(payload);
  } catch (err) {
    console.error("Failed to send message:", err.message);
  }
});

ipcMain.on("disconnect", async () => {
  if (swarm) {
    swarm.destroy();
    swarm = null;
    peers.length = 0;
    if (currentUser) {
      currentUser.online = false;
      await currentUser.save();
    }
    const users = await User.find({}, "username online").lean();
    const statusPayload = JSON.stringify({
      type: "user-status",
      users,
    });
    for (const peer of peers) peer.write(statusPayload);

    win.webContents.send("users", users);
    win.webContents.send("disconnected");

    currentUser = null;
    currentTopicDoc = null;
  }
});
