const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startChat: (data) => ipcRenderer.send("start", data),
  sendMessage: (payload) => ipcRenderer.send("message", payload),
  disconnect: () => ipcRenderer.send("disconnect"),
  getRooms: () => ipcRenderer.send("get-rooms"),
  onMessage: (callback) => ipcRenderer.on("message", (event, msg) => callback(msg)),
  onHistory: (callback) => ipcRenderer.on("history", (event, history) => callback(history)),
  onUsers: (callback) => ipcRenderer.on("users", (event, users) => callback(users)),
  onRoomList: (callback) => ipcRenderer.on("room-list", (event, topics) => callback(topics)),
  onDisconnected: (callback) => ipcRenderer.on("disconnected", () => callback())
});
