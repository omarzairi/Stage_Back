import mongoose from "mongoose";
var Schema = mongoose.Schema;

var userSchema = new Schema({
  jobOffer: {
    type: Schema.Types.ObjectId,
    ref: "JobOffer",
  },
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      isMatch: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const UsersLiked = mongoose.model("UsersLiked", userSchema);
export default UsersLiked;
