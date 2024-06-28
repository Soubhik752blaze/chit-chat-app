const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//responsible for loading a particular chat or creating a new chat for a user
const accessChat = async (req, res) => {
  let { userId } = req.body;

  if (!userId) {
    console.log("user Id not sent with params");
    res.status(400).json({
      message: "user Id not sent with params"
    })
  }

  // console.log("p1")
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // console.log("p2")
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  //if chat already is present
  // console.log("p3")
  if (isChat.length > 0) {
    res.send(isChat[0]);
  }
  //new chat to be created
  else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.populate(createdChat, { path: "users", select: "-password" });
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400).json({
        'message': error.message
      })
    }

  }
}

//fetch all chats which the user is part of
const fetchChats = async (req, res) => {
  const userId = req.user._id;
  try {
    const allChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });

  } catch (error) {
    res.status(400).json({
      'message': error.message
    });
  }
}

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({
      'message': error.message
    });
  }
}

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName, }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({
      'message': "Chat Not Found"
    });
  } else {
    res.json(updatedChat);
  }
}

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "Need a user to add to group" });
  }

  // const chatDetails = await Chat.find({
  //   isGroupChat: true,
  //   users: { $elemMatch: { $eq: userId } }
  // });
  // if (chatDetails) {
  //   return res.status(400).send({ message: "User is already part of the group" });
  // }

  const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId }, }, { new: true })
    .populate("users", "-password").populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({
      'message': "Chat not Found"
    });
  } else {
    res.json(updatedChat);
  }

}

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!userId) {
    // console.log("No such user")
    return res.status(400).send({ message: "Need a user to remove from group" });
  }

  // console.log("finding and updating chat")
  const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId }, }, { new: true })
    .populate("users", "-password").populate("groupAdmin", "-password");

  if (!updatedChat) {
    // console.log("no such chat")
    res.status(404).json({
      'message': "Chat not Found"
    });
  } else {
    res.json(updatedChat);
  }
}



module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
}