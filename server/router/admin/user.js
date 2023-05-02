import express from "express";
import { User } from "../../model/User.js";
import { auth } from "../../middlewares/auth.js";
import { authenticateRole } from "../../middlewares/authenticateRole.js";
import { Crime } from "../../model/Crime.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      throw new Error("Please provide userName and password");
    const user = await User.findByCredentials(userName, password);
    const token = await user.appendNewAuthToken();
    const totalCases = await Crime.find({ isPending: false });
    const officers = await User.find({});
    const totalSenior = await User.find({ designation: "senior_officer" });
    let extraDetails = {};
    if (user.designation === "senior_officer") {
      extraDetails.solvedCases = totalCases.length;
      extraDetails.totalOfficers = officers.length;
      extraDetails.officers = officers;
      extraDetails.totalSeniorOfficers = totalSenior.length;
    }
    res.send({ success: true, user, token, extraDetails });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

router.post(
  "/createUser",
  [auth, authenticateRole(["senior_officer"])],
  async (req, res) => {
    try {
      const { userName, password, designation, dateOfBirth, avatar } = req.body;
      if (!userName || !password || !designation || !dateOfBirth)
        throw new Error(
          "Please provide userName, designation, dateOfBirth and password"
        );
      const user = new User({
        userName,
        password,
        designation,
        dateOfBirth,
        avatar,
      });
      const token = await user.appendNewAuthToken();
      await user.save();
      res.send({ success: true, user, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

router.post(
  "/deleteUser",
  [auth, authenticateRole(["senior_officer"])],
  async (req, res) => {
    try {
      const { userId } = req.body;
      console.log("User id", userId);
      if (!userId) throw new Error("Please provide userId");

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error("User not found");
      }
      res.send({ success: true, message: "Officer deleted" });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

router.post(
  "/editUser",
  [auth, authenticateRole(["senior_officer"])],
  async (req, res) => {
    try {
      const { userId, designation, userName, avatar } = req.body;
      if (!userId) throw new Error("Please provide userId");

      const user = await User.findByIdAndUpdate(userId, {
        designation,
        userName,
        avatar,
      });
      if (!user) {
        throw new Error("User not found");
      }
      res.send({ success: true, message: "Officer updated" });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

router.get(
  "/me",
  [auth, authenticateRole(["senior_officer"])],
  async (req, res) => {
    try {
      const user = req.user;
      const totalCases = await Crime.find({ isPending: false });
      const officers = await User.find({});
      const totalSenior = await User.find({ designation: "senior_officer" });
      let extraDetails = {};
      if (user.designation === "senior_officer") {
        extraDetails.solvedCases = totalCases.length;
        extraDetails.totalOfficers = officers.length;
        extraDetails.officers = officers;
        extraDetails.totalSeniorOfficers = totalSenior.length;
      }
      res.send({ success: true, user, extraDetails });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

export default router;
