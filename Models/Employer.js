//create a mongodb schema for an employer in a job posting application
import mongoose from "mongoose";
const employerSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phone: {
    type: String,
    required: true,
  },
});
employerSchema.index({ name: "text" });
const Employer = mongoose.model("Employer", employerSchema);
export default Employer;
