import express from "express";
import asyncHandler from "express-async-handler";
import protectEmpl from "../Middleware/emplAuth.js";
import protect from "../Middleware/userAuth.js";
import JobOffer from "../Models/JobOffer.js";
import Employer from "../Models/Employer.js";
import LikedJobs from "../Models/likedJobs.js";
import UsersLiked from "../Models/usersLiked.js";
import Profile from "../Models/Profile.js";
import User from "../Models/User.js";
import Company from "../Models/Company.js";
const JobRoute = express.Router();

JobRoute.get(
  "/offers",
  asyncHandler(async (req, res) => {
    try {
      const jobOffers = await JobOffer.find({});
      res.status(200).json(jobOffers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

JobRoute.get(
  "/offer/:id",
  asyncHandler(async (req, res) => {
    const jobOfferId = req.params.id;
    try {
      const jobOffer = await JobOffer.findById(jobOfferId);
      if (!jobOffer) {
        res.status(404).json({ message: "Job offer not found" });
      } else {
        res.status(200).json(jobOffer);
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

JobRoute.post(
  "/add",
  protectEmpl,
  asyncHandler(async (req, res) => {
    const jobOffer = new JobOffer({
      title: req.body.title,
      description: req.body.description,
      employerId: req.employer._id,
      salary: req.body.salary,
      skills: req.body.skills,
      category: req.body.category,
    });

    try {
      const savedOffer = await jobOffer.save();
      await UsersLiked.create({
        jobOffer: savedOffer._id,
        users: [],
      });
      res.status(201).json({
        savedOffer,
        message: "Job offer added successfully",
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
JobRoute.delete(
  "/deleteoffer/:id",
  protectEmpl,
  asyncHandler(async (req, res) => {
    const jobOfferId = req.params.id;

    try {
      const jobOffer = await JobOffer.findById(jobOfferId);

      if (!jobOffer) {
        res.status(404).json({ message: "Job offer not found" });
      }
      if (req.employer._id.toString() !== jobOffer.employerId.toString()) {
        res.status(401).json({ message: "Unauthorized !" });
      } else {
        await JobOffer.findByIdAndDelete(jobOfferId);
        await UsersLiked.findOneAndDelete({ jobOffer: jobOfferId });
        res.status(200).json({ message: "Job offer deleted successfully" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

JobRoute.get(
  "/companyoffers",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const employer = await Employer.findById(req.employer._id);

      const employers = await Employer.find({ companyId: employer.companyId });
      const employerIds = employers.map((employer) => employer._id);
      const jobOffers = await JobOffer.find({
        employerId: { $in: employerIds },
      });

      return res.status(200).json(jobOffers);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })
);
//searxh company offers
JobRoute.get(
  "/companyoffers/:name",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const employer = await Employer.findById(req.employer._id);

      const employers = await Employer.find({ companyId: employer.companyId });
      const employerIds = employers.map((employer) => employer._id);
      const jobOffers = await JobOffer.find({
        employerId: { $in: employerIds },
        $text: { $search: req.params.name },
      });

      return res.status(200).json(jobOffers);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  })
);

JobRoute.get(
  "/employeroffers",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const employerId = req.employer._id;
      const jobOffers = await JobOffer.find({ employerId });
      res.status(200).json(jobOffers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
JobRoute.get(
  "/unlikedoffers/:name",
  protect,
  asyncHandler(async (req, res) => {
    const jobSeekerId = req.user._id;

    try {
      const likedJobs = await LikedJobs.findOne({ user: jobSeekerId });
      const unlikedOffers = await JobOffer.find({
        _id: { $nin: likedJobs.jobOffer.map((job) => job.offer) },
        $text: { $search: req.params.name },
      });
      res.status(200).json(unlikedOffers);
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  })
);
// JobRoute.post(
//   "/like/:id",
//   protect,
//   asyncHandler(async (req, res) => {
//     const jobOfferId = req.params.id;
//     try {
//       const user = await LikedJobs.findOne({ user: req.user._id });
//       const exists = user.jobOffer.find((offer) => offer.offer == jobOfferId);
//       if (exists) {
//         res.status(400).json({ message: "Job offer already liked" });
//       }
//       const newOffer = {
//         offer: jobOfferId,
//         isMatch: false,
//       };
//       user.jobOffer.push(newOffer);
//       // Find the job offer in the database
//       const jobOffer = await UsersLiked.findOne({ jobOffer: jobOfferId });
//       // Check if the job offer is liked by the employer
//       const exists2 = jobOffer.users.find((user) => user.user == user._id);
//       if (exists2) {
//         // Update the match status of the job offer
//         const jobIndex = user.jobOffer.findIndex(
//           (job) => job._id === jobOfferId
//         );
//         const seekerIndex = jobOffer.users.findIndex(
//           (seeker) => seeker._id === user._id
//         );
//         jobOffer.users.push(req.user._id);
//         await user.save();
//         await jobOffer.save();
//         res.status(200).json({ message: "It's a match!" });
//       } else {
//         // Save the updated user to the database
//         await user.save();
//         res.status(200).json({ message: "Job offer liked" });
//       }
//     } catch (err) {
//       res.status(500).json({ message: "Internal server error" });
//     }
//   })
// );
JobRoute.post(
  "/like/:id",
  protect,
  asyncHandler(async (req, res) => {
    const jobOfferId = req.params.id;
    try {
      // Find the user's liked jobs in the database
      const user = await LikedJobs.findOne({ user: req.user._id });
      // Check if the job offer is already in the user's liked jobs
      const exists = user.jobOffer.find((offer) => offer.offer == jobOfferId);
      if (exists) {
        return res.status(400).json({ message: "Job offer already liked" });
      }
      // Create a new object for the job offer
      const newOffer = {
        offer: jobOfferId,
        isMatch: false,
      };
      // Add the new job offer to the user's liked jobs

      // Find the job offer in the database
      const jobOffer = await UsersLiked.findOne({ jobOffer: jobOfferId });
      // Check if the user is liked by the employer
      const exists2 = jobOffer.users.find(
        (user) => user.user.toString() == req.user._id
      );
      if (exists2) {
        // Update the match status of the job offer
        const jobOfferIndex = jobOffer.users.findIndex(
          (user) => user.user.toString() == req.user._id
        );
        jobOffer.users[jobOfferIndex].isMatch = true;
        newOffer.isMatch = true;
        user.jobOffer.push(newOffer);
        await jobOffer.save();
        await user.save();
        res.status(200).json({ message: "It's a match!" });
      } else {
        // Save the updated user to the database
        user.jobOffer.push(newOffer);
        await user.save();
        res.status(200).json({ message: "Job offer liked" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
//get liked job offers
JobRoute.get(
  "/likedoffers",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const user = await LikedJobs.findOne({ user: req.user._id });
      const likedOffers = await JobOffer.find({
        _id: { $in: user.jobOffer.map((job) => job.offer) },
      });
      res.status(200).json(likedOffers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

//get matched job offers
JobRoute.get(
  "/matchedoffers",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const user = await LikedJobs.findOne({ user: req.user._id });
      const matchedOffers = await JobOffer.find({
        _id: {
          $in: user.jobOffer
            .filter((job) => job.isMatch)
            .map((job) => job.offer),
        },
      });
      res.status(200).json(matchedOffers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
//get matched job seekers for a job offer
JobRoute.get(
  "/matchedseekers/:id",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const jobOffer = await UsersLiked.findOne({ jobOffer: req.params.id });
      const matchedSeekers = await User.find({
        _id: {
          $in: jobOffer.users
            .filter((user) => user.isMatch)
            .map((user) => user.user),
        },
      });
      res.status(200).json(matchedSeekers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
//search job offers by title
JobRoute.get(
  "/search/:title",
  asyncHandler(async (req, res) => {
    try {
      const jobOffers = await JobOffer.find({
        title: { $regex: req.params.title, $options: "i" },
      });
      res.status(200).json(jobOffers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

export default JobRoute;
