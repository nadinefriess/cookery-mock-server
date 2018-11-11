import mongoose from "mongoose";
const Schema = mongoose.Schema;
let Recipe = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  }
});

export default mongoose.model("Recipe", Recipe);
