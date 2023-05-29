import express from "express";
import "./db/mongodb.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ success: true, message: "API working" });
});

//////////////////ADMIN ROUTES //////////////////
import adminUserRouter from "./router/admin/user.js";
app.use(adminUserRouter);

import adminCrimeRouter from "./router/admin/crime.js";
app.use(adminCrimeRouter);

//////////////////USER ROUTES //////////////////
import userRouter from "./router/user/user.js";
app.use(userRouter);

//////////////////GENERAL ROUTES //////////////////
import generalCrimeRouter from "./router/general/crime.js";
app.use(generalCrimeRouter);

// // API endpoint for fetching an image
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.get("/image/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    console.log("TEST");
    const imagePath = `uploads/${filename}`;
    res.sendFile(imagePath, { root: __dirname });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

app.listen(3000, () => {
  console.log("Listening at ", 3000);
});
