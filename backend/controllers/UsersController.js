import Data from "../models/UsersModel.js";
import MUUID from "uuid-mongodb";

import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const saltRounds = 10; // Jumlah putaran salt
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const validatePassword = (password) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()<>?.,:;"'{}\[\]_+\-=])[a-zA-Z\d!@#$%^&*()<>?.,:;"'{}\[\]_+`~\-=]{8,}$/.test(
    password
  );
};

export const getDatas = async (req, res) => {
  try {
    const datas = await Data.find();
    res.json(datas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDataById = async (req, res) => {
  const _id = MUUID.from(req.params.id);
  try {
    const datas = await Data.findById(_id);
    res.json(datas);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const saveData = async (req, res) => {
  const { name, email, password, role, gender, status } = req.body;

  if (!name || !email || !password || !role || !gender || !status) {
    return res.status(400).json({ message: "All field harus diisi" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email tidak valid" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password harus terdiri dari setidaknya 8 karakter, satu huruf besar, satu huruf kecil, dan satu angka",
    });
  }
  try {
    const hashedPassword = await hashPassword(password);

    const data = new Data({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      status,
    });

    // Menyimpan data ke dalam database
    const savedData = await data.save();
    res.status(201).json({ savedData, message: "Data saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editData = async (req, res) => {
  let _id;
  try {
    _id = MUUID.from(req.params.id);
  } catch (e) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    const existingData = await Data.findById(_id);
    if (!existingData) {
      return res.status(404).json({ message: "Data not found !" });
    }

    const updatedData = await Data.updateOne(
      { _id: _id },
      {
        $set: req.body,
      }
    );

    res.status(200).json({ updatedData, message: "Data updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editPassword = async (req, res) => {
  let _id;
  try {
    _id = MUUID.from(req.params.id);
  } catch (e) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    const existingData = await Data.findById(_id);
    if (!existingData) {
      return res.status(404).json({ message: "Data not found !" });
    }

    const { oldpassword, password } = req.body;

    if (!password || !oldpassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldpassword,
      existingData.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await hashPassword(password);

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }

    const isNewPasswordSameAsOld = await bcrypt.compare(
      hashedNewPassword,
      existingData.password
    );
    if (isNewPasswordSameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from old password" });
    }

    existingData.password = hashedNewPassword;

    await existingData.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteData = async (req, res) => {
  let _id;
  try {
    _id = MUUID.from(req.params.id);
  } catch (e) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    await Data.deleteOne({ _id: _id });
    res.status(200).json({  message: "Data deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
