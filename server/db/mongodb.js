import mongoose from "mongoose";
import { User } from "../model/User.js";

const init = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/rdta");
    console.log("Connected to database");
    await addSuperAdmin();
    console.log("Super admin added");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
};

const addSuperAdmin = async () => {
  try {
    const user = new User({
      userName: "annas",
      password: "Password",
      designation: "super_admin",
    });
    await user.save();
  } catch (error) {
    console.log("Error adding user");
  }
};

init();
