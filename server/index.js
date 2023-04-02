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

app.post(
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

app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      throw new Error("Please provide userName and password");
    const user = await User.findByCredentials(userName, password);
    const token = await user.appendNewAuthToken();
    res.send({ success: true, user, token });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

app.post("/reportCrime", async (req, res) => {
  try {
    const crime = new Crime(req.body);
    await crime.save();
    res.send({ success: true, message: "Tip submitted successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

app.get("/crimes", auth, async (req, res) => {
  try {
    const crimes = await Crime.find();
    res.send({ success: true, crimes });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

app.listen(3000, () => {
  console.log("Listening at ", 3000);
});
