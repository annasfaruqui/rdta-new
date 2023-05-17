import express from "express";
import { Crime } from "../../model/Crime.js";
import { auth } from "../../middlewares/auth.js";
import { authenticateRole } from "../../middlewares/authenticateRole.js";
const router = express.Router();

router.post(
  "/crimeSolved",
  [auth, authenticateRole(["super_admin", "admin"])],
  async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) throw new Error("Please provide id");
      await Crime.findByIdAndUpdate(id, { isPending: false });
      res.send({ success: true, message: "Status updated" });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

router.post(
  "/deleteCrime",
  [auth, authenticateRole(["super_admin", "admin"])],
  async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) throw new Error("Please provide id");
      const crime = await Crime.findByIdAndRemove(id);
      if (!crime) {
        throw new Error("Crime not found");
      }
      res.send({ success: true, message: "Crime deleted" });
    } catch (error) {
      res.status(400).send({ success: false, message: error?.message });
    }
  }
);

export default router;
