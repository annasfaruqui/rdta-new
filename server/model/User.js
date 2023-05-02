import mongoose from "mongoose";
import crypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    validate(value) {
      if (
        !["senior_officer", "junior_officer", "super_admin"].includes(value)
      ) {
        throw new Error("Invalid designation");
      }
    },
  },
  avatar: {
    type: String,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  tokens: [{ type: String }],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await crypt.hash(user.password, 8);
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.appendNewAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisIsSecret", {
    expiresIn: "1 day",
  });
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function (userName, password) {
  let user;
  user = await User.findOne({
    userName: userName,
  });
  if (!user) {
    throw new Error("Username does not exist.");
  }
  const isMatch = await crypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect credentials!");
  }
  return user;
};

export const User = mongoose.model("User", userSchema);
