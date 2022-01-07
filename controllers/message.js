const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const Message = require("../models/Message");
const User = require("../models/User");
const Rooms = require("../models/Rooms");
const express = require("express");
const { log } = require("console");
const router = express.Router();
//const Buffer = require("buffer");
//const getStream = require('get-stream')

const s3 = new AWS.S3({
  accessKeyId: process.env.Access_Key_Id,
  secretAccessKey: process.env.Secret_Access_Key,
});
const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 20000000 } }).single(
  "uploadFile"
);

const addMessage = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const { RoomId, text, type, nameFile } = req.body;
    const room = await Rooms.findOne({ _id: RoomId });
    if (room.active == true) {
      req.io.to(RoomId).emit("send-message", {
        RoomId: RoomId,
        text: text,
        nameFile: nameFile,
        sender: foundUser._id,
        type: type,
      });
      const savedMessage = await Message.create({
        RoomId: RoomId,
        text: text,
        nameFile: nameFile,
        sender: foundUser._id,
        type: type,
      });
      return res.status(200).json(savedMessage);
    }
    res.status(400).json({ message: "Không thể Gửi được tin nhắn" });
  } catch (err) {
    next(err);
  }
};
const addFile = async (req, res, next) => {
  try {
    console.log("AAAAA");
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json("LOI NEK");
      }
      console.log(req.file);
      const uploadFile = req.file.originalname.split(".");
      const filesTypes = uploadFile[uploadFile.length - 1];
      const filePath = `${uuid() + Date.now().toString()}.${filesTypes}`;
      const params = {
        // Body : await getStream(req.file.stream),
        Body: req.file.buffer,
        Bucket: "18049511-tranngochien-iuh",
        Key: filePath,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };
      console.log("dòng 76");
      s3.upload(params, (error, data) => {
        if (error) return res.send("LOI");
        console.log("AAAA");
        return res.status(200).send(data.Location);
      });
    });
  } catch (error) {
    next(error);
  }
};
const cancelMessage = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const message = await Message.findOne({
      _id: req.params.messageId,
    });
    message.active = false;
    await message.save();
    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
};
const getMessage = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const messages = await Message.find({
      RoomId: req.params.RoomID,
    });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};
// RTC
const callVideo = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const { RoomId } = req.body;

    const room = await Rooms.findOne({ _id: RoomId });
    const nameMessUserId = room.users.find(
      (m) => m != foundUser._id.toString()
    );
    const userAnother = await User.findOne({ _id: nameMessUserId });
    // -------------------------------------------
    req.io.to(foundUser.socketId).emit("me", foundUser.socketId, userAnother);

    // -------------------------------------------
    //  console.log(userAnother + " user ngừ khác");
    //  console.log(nameMessUserId + " Userid ngừ khác");
    // console.log(nameMessUserId + "ID NGỪ KHÁC" + foundUser._id);
    if (room.active == true) {
      console.log("Đã zô tới đây " + foundUser.socketId);
      return res.status(200).json({});
    }

    res.status(401).json({ message: "Không thể gọi video" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addMessage,
  addFile,
  cancelMessage,
  getMessage,
  callVideo,
};
