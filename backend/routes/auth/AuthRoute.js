import express from "express";

import {
  signUp,
  Login,
  Logout,
} from "../../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", Login);
router.post("/logout", Logout);

export default router;
