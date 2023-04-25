//create a mongodb schema for a profile in a job posting application
import mongoose from "mongoose";
const profileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" || "Employer",
    required: true,
  },
  image: {
    type: String,
  },
  profession: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  education: [
    {
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        required: true,
      },
      school: {
        type: String,
        required: true,
      },
    },
  ],
  experience: [
    {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      position: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        required: true,
      },
    },
  ],
});
profileSchema.index({
  profession: "text",
});
const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
