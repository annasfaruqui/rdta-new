import mongoose from "mongoose";

const crimeSchema = mongoose.Schema({
  criminalName: {
    type: String,
  },
  criminalAge: {
    type: Number,
  },
  suspectedLocation: {
    type: String,
    required: true,
  },
  invlovedPeople: {
    type: Number,
    required: true,
  },
  tip: {
    type: String,
    required: true,
  },
});

export const Crime = mongoose.model("Crime", crimeSchema);
