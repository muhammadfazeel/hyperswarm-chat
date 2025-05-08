# 🔗 Hyperswarm Electron P2P Chat with MongoDB

A real-time peer-to-peer chat application built using **Electron**, **Hyperswarm**, and **MongoDB**, featuring decentralized messaging, persistent chat history, and real-time user status tracking.

---

## ✨ Features

- 🔐 **Encrypted P2P Messaging** using Hyperswarm (no central server)
- 🧑‍🤝‍🧑 **Multi-user chatrooms** (topics) with unique usernames
- 🗃️ **Persistent chat history** stored in MongoDB
- 🟢 **Real-time online/offline status** visible to all peers
- 🧠 **Auto-load previous messages** on reconnect
- ⚡ Built with **Electron** for a desktop app experience

---

## 📦 Technologies Used

- **Node.js** (Electron runtime)
- **Hyperswarm** (Peer-to-peer networking via DHT)
- **MongoDB + Mongoose** (Data storage and schema management)
- **HTML, CSS, JavaScript** (Frontend UI)

---

## 🚀 How It Works

1. Users join a chat room by entering a **unique username** and a **room name (topic)**.
2. A secure topic hash is generated and joined via **Hyperswarm**.
3. Messages are sent **directly between peers** and saved in MongoDB.
4. On disconnect, users are marked offline; others are notified instantly.
5. On reconnect, the user’s **message history is reloaded** from MongoDB.

---

## 🗂 Folder Structure

project-root/
│
├── main.js # Electron app entry (backend + Hyperswarm logic)
├── preload.js # Secure bridge between Electron backend and frontend
├── index.html # Frontend chat interface
├── db.js # MongoDB schemas (User, Topic, Message)
├── package.json # Node + Electron app metadata
└── README.md # You're here!



---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/hyperswarm-p2p-chat.git
cd hyperswarm-p2p-chat

# Install dependencies
npm install

# Start your MongoDB server
# Then start the Electron app
npm start
📝 Note: Ensure MongoDB is running locally at mongodb://localhost:27017/p2pchat or update the connection string in db.js.

📸 UI Overview
Chat window with messages

Connected user info (with online/offline indicators)

Realtime syncing between peers via Hyperswarm

🛡 Security
Hyperswarm uses the Noise protocol for secure encrypted connections.

All data between peers is end-to-end encrypted by default.

📃 License
This project is licensed under the MIT License.

👨‍💻 Author
Made with ❤️ by Muhammad Fazeel

