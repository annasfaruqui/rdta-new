import express from "express";
import "./db/mongodb.js";
import { User } from "./model/User.js";
import { Crime } from "./model/Crime.js";
import { auth } from "./middlewares/auth.js";
import { authenticateRole } from "./middlewares/authenticateRole.js";
import cors from "cors";

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

app.listen(3000, () => {
  console.log("Listening at ", 3000);
});
