import express from "express";
import { Crime } from "../../model/Crime.js";
import { auth } from "../../middlewares/auth.js";
const router = express.Router();

router.get("/crimes", auth, async (req, res) => {
  try {
    const crimes = await Crime.find();
    res.send({ success: true, crimes });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

export default router;
