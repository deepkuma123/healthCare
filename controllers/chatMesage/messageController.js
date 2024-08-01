const mongoose = require("mongoose");
const { renameSync } = require("fs");
const Message = require("../../models/chatMessage/message");
const User = require("../../models/userModel");

const addMessage = async (req, res, next) => {
  try {
    const { message, from, to } = req.body;
    const getUser = OnlineUsers.get(to);
    // console.log(OnlineUsers);
    console.log({ getUser });

    if (message && from && to) {
      const newMessage = new Message({
        message,
        senderId: from,
        receiverId: to,
        messageStatus: getUser ? "delivered" : "sent",
      });
      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage);
      // .populate("senderId")
      // .populate("receiverId");

      return res.status(201).send({ message: populatedMessage });
    }
    return res.status(400).send("From, to and Message are required.");
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.params;
    console.log(from);

    const messages = await Message.find({
      $or: [
        {
          senderId: from,
          receiverId: to,
        },
        {
          senderId: to,
          receiverId: from,
        },
      ],
    }).sort({ createdAt: "asc" });

    const unreadMessages = [];
    messages.forEach((message) => {
      if (
        message.messageStatus !== "read" &&
        message.receiverId.toString() === to
      ) {
        message.messageStatus = "read";
        unreadMessages.push(message._id);
      }
    });

    await Message.updateMany(
      { _id: { $in: unreadMessages } },
      { $set: { messageStatus: "read" } }
    );

    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { from, to } = req.query;

      if (from && to) {
        const message = new Message({
          message: fileName,
          senderId: from,
          receiverId: to,
          type: "image",
        });
        await message.save();
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to are required");
    }
    return res.status(400).send("Image is required");
  } catch (err) {
    next(err);
  }
};

const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { from, to } = req.query;

      if (from && to) {
        const message = new Message({
          message: fileName,
          senderId: mongoose.Types.ObjectId(from),
          receiverId: mongoose.Types.ObjectId(to),
          type: "audio",
        });
        await message.save();
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to are required");
    }
    return res.status(400).send("Audio is required");
  } catch (err) {
    next(err);
  }
};

const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = req.params.from;

    // console.log(userId);

    const user = await User.findById(userId)
      .populate("sendMessages")
      .populate("receivedMessages")
      .exec();
    console.log({ user });

    // console.log({ user });

    const messages = [...user.sendMessages, ...user.receivedMessages];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    // console.log({ messages });
    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      console.log({ msg });
      const isSender = msg.senderId.toString() === userId.toString();
      const calculatedId = isSender ? msg.receiverId : msg.senderId;
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg._id);
      }
      const {
        _id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = msg;
      if (!users.get(calculatedId.toString())) {
        let user = {
          messageId: _id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.receiverId._doc,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.senderId._doc,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId.toString(), { ...user });
      } else if (messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId.toString());
        users.set(calculatedId.toString(), {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await Message.updateMany(
        { _id: { $in: messageStatusChange } },
        { $set: { messageStatus: "delivered" } }
      );
    }

    return res.status(201).json({
      users: Array.from(users.values()),
      OnlineUsers: Array.from(OnlineUsers.keys()),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addMessage,
  getInitialContactsWithMessages,
  addImageMessage,
  addAudioMessage,
  getMessages,
};
