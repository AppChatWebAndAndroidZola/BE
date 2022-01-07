const Message = require("../models/Message");
const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt.service");
const MessageController = require("../controllers/message");
//add
router.post("/addFile",MessageController.addFile);

router.post("/addMessage",verifyAccessToken,MessageController.addMessage);

router.put("/cancelMessage/:messageId",verifyAccessToken,MessageController.cancelMessage);
//get
router.get("/:RoomID",verifyAccessToken,MessageController.getMessage);
//call
router.post("/callVideo", verifyAccessToken, MessageController.callVideo);


module.exports = router;
