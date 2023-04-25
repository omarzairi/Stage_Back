//create a mongodb model for a user's liked jobs in a job posting application
import mongoose from "mongoose";
var Schema = mongoose.Schema;

var LikedJobsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  jobOffer: [
    {
      offer: {
        type: Schema.Types.ObjectId,
        ref: "JobOffer",
        required: true,
      },
      isMatch: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const LikedJobs = mongoose.model("LikedJobs", LikedJobsSchema);
export default LikedJobs;
