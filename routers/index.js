const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const AuthsRouter = require("./auth");
const UsersRouter = require("./users");
const UsersRequestRouter = require("./userRequest");
const RoomsRouter = require("./rooms");
const MessageRouter = require("./messages");
router.use("/auth", AuthsRouter);
router.use("/users", UsersRouter);
router.use("/userRequest", UsersRequestRouter);
router.use("/rooms", RoomsRouter);
router.use("/messages", MessageRouter);

module.exports = router;
