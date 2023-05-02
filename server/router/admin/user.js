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
    const totalOfficers = await User.countDocuments();
    let extraDetails = {};
    if (user.designation === "senior_officer") {
      extraDetails.solvedCases = totalCases.length;
      extraDetails.totalOfficers = totalOfficers;
    }
    res.send({ success: true, user, token, extraDetails });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

router.post(
  "/createUser",
  [auth, authenticateRole(["super_admin"])],
  async (req, res) => {
    try {
      const { userName, password, designation } = req.body;
      if (!userName || !password || !designation)
        throw new Error("Please provide userName, designation and password");
      const user = new User({ userName, password, designation });
      const token = await user.appendNewAuthToken();
      await user.save();
      res.send({ success: true, user, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

export default router;
