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
  involvedPeople: {
    type: Number,
    required: true,
  },
  tip: {
    type: String,
    required: true,
  },
  isPending: {
    type: Boolean,
    default: true,
  },
});

export const Crime = mongoose.model("Crime", crimeSchema);
