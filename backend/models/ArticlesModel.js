import mongoose from "mongoose";
import MUUID from "uuid-mongodb";

const modelName = "Articles";

const Data = mongoose.Schema(
  {
    _id: {
      type: "object",
      value: { type: "Buffer" },
      default: () => MUUID.v4(),
    },
    title: {
      type: "string",
      required: true,
      unique: true,
      minlength: 10,
    },
    
    description: {
      type: "string",
      required: true,
      minlength: 10,
    },

    status: {
      type: "string",
      enum: ["active", "nonactive"],
      default: "active",
      required: true,
    },
    
    author: {
      type: "string",
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model(modelName, Data);
