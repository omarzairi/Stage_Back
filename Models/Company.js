//create a mongodb schema for a company in a job posting application
import mongoose from "mongoose";
const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
});
companySchema.index({ name: "text" });
const Company = mongoose.model("Company", companySchema);
export default Company;
