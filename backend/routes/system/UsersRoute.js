import express from "express";
import {
  getDatas,
  getDataById,
  saveData,
  editData,
  deleteData,
} from "../../controllers/UsersController.js";

const router = express.Router();
const path = "/user";

router.get(path + "s", getDatas);
router.post(path, saveData);
router.get(path + "/:id", getDataById);
router.patch(path + "/:id", editData);
router.delete(path + "/:id", deleteData);

export default router;
