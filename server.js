// require("dotenv").config();

// const mongoose = require("mongoose");
// mongoose.connect(process.env.MONGOURI);

// const express = require("express");
// const app = express();

// const port = process.env.SERVER_PORT || 3000;

// const userRoute = require("./routes/userRoutes");
// const categoryRoutes = require("./routes/categories");
// const shareMeetRoutes = require("./routes/sharemeets");
// const communityRoutes = require("./routes/communities");
// const donateList = require("./routes/donate");
// const classCategoryRoutes = require("./routes/OnlineClassRoute/categoryRoutes");
// const instructorRoutes = require("./routes/OnlineClassRoute/instructorRoutes");
// const classRoutes = require("./routes/OnlineClassRoute/classRoutes");
// const subscriptionRoutes = require("./routes/OnlineClassRoute/subscription");
// const messageRoutes = require("./routes/chatMessage/message");

// // Set up EJS as the templating engine
// app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api", userRoute);
// app.use("/api", categoryRoutes);
// app.use("/api/sharemeets", shareMeetRoutes);
// app.use("/api/communities", communityRoutes);
// app.use("/api", donateList);
// app.use("/api", classCategoryRoutes);
// app.use("/api", instructorRoutes);
// app.use("/api", classRoutes);
// app.use("/api", subscriptionRoutes);
// app.use("/api", messageRoutes);

// app.listen(port, function () {
//   console.log("server listen on port" + port);
// });

require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURI);

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const port = process.env.SERVER_PORT || 5000;

const userRoute = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categories");
const shareMeetRoutes = require("./routes/sharemeets");
const communityRoutes = require("./routes/communities");
const donateList = require("./routes/donate");
const classCategoryRoutes = require("./routes/OnlineClassRoute/categoryRoutes");
const instructorRoutes = require("./routes/OnlineClassRoute/instructorRoutes");
const classRoutes = require("./routes/OnlineClassRoute/classRoutes");
const subscriptionRoutes = require("./routes/OnlineClassRoute/subscription");
const messageRoutes = require("./routes/chatMessage/message");
const serviceRoute = require("./routes/services/serviceRoute");

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(cors());
// Serve static files for uploads
app.use(
  "/uploads/recordings",
  express.static(path.join(__dirname, "uploads", "recordings"))
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoute);
app.use("/api", categoryRoutes);
app.use("/api/sharemeets", shareMeetRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api", donateList);
app.use("/api", classCategoryRoutes);
app.use("/api", instructorRoutes);
app.use("/api", classRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", messageRoutes);
app.use("/api", serviceRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.OnlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    // console.log(userId);
    OnlineUsers.set(userId, socket.id);
    // console.log("user added");
    // console.log({ OnlineUsers: Array.from(OnlineUsers.keys()) });
    socket.broadcast.emit("online-users", {
      OnlineUsers: Array.from(OnlineUsers.keys()),
    });
    if (
      socket.broadcast.emit("online-users", {
        OnlineUsers: Array.from(OnlineUsers.keys()),
      })
    ) {
      console.log("signal broadcasted");
      // console.log(OnlineUsers);
    }
  });

  socket.on("signout", (id) => {
    OnlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      OnlineUsers: Array.from(OnlineUsers.keys()),
    });
    // console.log({ UserGaya: OnlineUsers });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = OnlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on("contact-msg", (data) => {
    const sendUserSocket = OnlineUsers.get(data.to);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      // Emit the "new-message" event with the received users data
      socket.to(sendUserSocket).emit("new-message", {
        users: data.users,
        OnlineUsers: data.OnlineUsers,
      });
      console.log(data.users);
    }
  });

  // socket.on("new-message", (data) => {
  //   // Handle the new message event
  //   // Assuming OnlineUsers is a Map, you need to use get() to retrieve the socket ID
  //   const sendUserSocket = OnlineUsers.get(data.users);

  //   if (sendUserSocket) {
  //     console.log("New message received:", data.users);

  //     // Emit an event to the client to inform about the new message
  //   }
  // });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("reject-video-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });

  socket.on("accept-incoming-call", ({ id }) => {
    const sendUserSocket = OnlineUsers.get(id);
    socket.to(sendUserSocket).emit("accept-call");
  });
});
server.listen(port, function () {
  console.log("server listening on port " + port);
});
