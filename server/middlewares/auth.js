import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

export const auth = async (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization) throw new Error("Authorization needed");
    const userToken = authorization.replace("Bearer ", "");
    if (!userToken || !(typeof userToken === "string")) {
      throw new Error("Authorization needed");
    }
    const decoded = jwt.verify(userToken, "thisIsSecret");
    const user = await User.findOne({
      _id: decoded._id,
      tokens: userToken,
    });
    if (!user) throw new Error("Please authenticate");
    req.user = user;
    req.token = userToken;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: error?.message });
  }
};
