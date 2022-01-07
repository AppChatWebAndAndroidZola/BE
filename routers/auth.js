const AuthController = require("../controllers/auth");
const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt.service");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/user.validate");

router
  .route("/signup")
  .post(validateBody(schemas.authSignUpSchema), AuthController.signUp);

router
  .route("/signin")
  .post(validateBody(schemas.authSignInSchema), AuthController.signIn);

router
  .route("/changePassword")
  .post(
    validateBody(schemas.authChangePasswordSchema),
    verifyAccessToken,
    AuthController.ChangePassword
  );

router.route("/refreshToken").post(AuthController.refreshToken);

router.route("/logout").post(AuthController.Logout);

router.route("/sendOtp").post(AuthController.sendOTP);

router.route("/verifyOtpSignUp").post(AuthController.verifyOTPSignUp);

router.route("/forgotPassword").post(AuthController.forgotPassword);

router.route("/checkPhone").post(AuthController.checkPhone);

router.route("/checkPhoneAlready").post(AuthController.checkPhoneAlready);

module.exports = router;
