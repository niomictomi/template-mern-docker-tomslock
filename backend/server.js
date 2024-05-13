import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";

import requireAuth from "./moddleware/requireAuthMiddleware.js";
import Authentication from "./routes/auth/AuthRoute.js";
import UsersRoute from "./routes/system/UsersRoute.js";
import ArticlesRoute from "./routes/system/ArticlesRoute.js";

dotenv.config();

const corsConfig = {
  credentials: true,
  origin: process.env.FRONT_END_URL,
};


const app = express();
app.use(cors(corsConfig));

const PORT = process.env.PORT || 5000;

const MONGO_URI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27019`;

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e.message);
  }
};

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

const redisClient = createClient({
  url: "redis://redis:6379",
});

redisClient
.connect()
.then(() => console.log("Redis connected successfully"))
.catch((e) => {
  console.error("Redis connection failed:", e.message);
});

const redisStore = new RedisStore({
  client: redisClient,
});

const sessionConfig = {
  store: redisStore,
  secret: process.env.SESSION_SECRET || "65789340treygnkbjvghfDTR^&TYUIJKBVHJI%$#@sdsd", 
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24, 
    sameSite: "lax", 
  },
};

app.use(session(sessionConfig));

app.get("/", function (req, res) {
  res.json("Halo :)");
});

app.get("/check-auth", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        email: req.session.user.email,
        name: req.session.user.name,
        role: req.session.user.role,
      },
    });
  } else {
    res.status(401).json({ authenticated: false, message: "Unauthorized" });
  }
});
app.use(Authentication);

app.use(requireAuth);

app.get("/welcome", function (req, res) {
  res.json("Welcome to the Systems " + process.env.FRONT_END_URL + " ---- Session user: "+req.session.user.name);
});


app.use(UsersRoute);
app.use(ArticlesRoute);


app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => {
  console.log(
    `\n----------------------------------------------------\n` +
    `             SERVER IS RUNNING ON PORT ${PORT}\n` +
    `----------------------------------------------------`
  );
});
