//create a mongodb schema for a job in a job posting application
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobOfferSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  employerId: {
    type: Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  salary: {
    type: Number,
  },
  skills: {
    type: [String],
    required: true,
  },
});
jobOfferSchema.index({ title: "text" });
const JobOffer = mongoose.model("JobOffer", jobOfferSchema);
export default JobOffer;
