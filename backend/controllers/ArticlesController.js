import Data from "../models/ArticlesModel.js";
import MUUID from "uuid-mongodb";

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
  const { title, description, status, author } = req.body;

  if (!title || !description || !status || !author ) {
    return res.status(400).json({ message: "All field harus diisi" });
  }

  try {

    const data = new Data({
      title,
      description,
      author,
      status,
    });

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
