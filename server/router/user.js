import express from "express";
import { Crime } from "../model/Crime.js";
const router = express.Router();

router.post("/reportCrime", async (req, res) => {
  try {
    const crime = new Crime(req.body);
    await crime.save();
    res.send({ success: true, message: "Tip submitted successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

export default router;
