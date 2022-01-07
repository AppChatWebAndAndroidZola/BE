const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt.service");
const UserRequestController = require("../controllers/userRequest")

router
  .route("/checkSendRequest/:userID")
  .get(verifyAccessToken, UserRequestController.checkSendRequest);

router.get("/getListSenderRequest",verifyAccessToken,UserRequestController.getListSenderRequest);
router.get("/getListReceiver", verifyAccessToken, UserRequestController.getListReceiver);



module.exports = router;