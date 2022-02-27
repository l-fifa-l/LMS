import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
  sendTestEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import { requireSignin } from "../middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
// To send email
// router.get("/send-email", sendTestEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
