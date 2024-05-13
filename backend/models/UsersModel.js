import mongoose from "mongoose";
import MUUID from "uuid-mongodb";

const modelName = "Users";

const Data = mongoose.Schema(
  {
    _id: {
      type: "object",
      value: { type: "Buffer" },
      default: () => MUUID.v4(),
    },
    name: {
      type: "string",
      required: true,
      unique: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Email tidak valid",
      },
    },
    password: {
      type: "string",
      required: true,
      minlength: 8,
    },

    role: {
      type: "string",
      enum: ["superadministrator", "administrator", "editor", "user", "viewer"],
      default: "editor",
      required: true,
    },
    gender: {
      type: "string",
      required: true,
      enum: ["male", "female"],
      default: "male",
    },

    status: {
      type: "string",
      enum: ["aktif", "nonaktif"],
      default: "aktif",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(modelName, Data);
