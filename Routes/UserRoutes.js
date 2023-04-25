import express from "express";
import asyncHandler from "express-async-handler";
import LikedJobs from "../Models/likedJobs.js";
import User from "../Models/User.js";
import generateToken from "../utils/generateToken.js";
import protectEmpl from "../Middleware/emplAuth.js";
import protect from "../Middleware/userAuth.js";
import UsersLiked from "../Models/usersLiked.js";
const UserRoutes = express.Router();

UserRoutes.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    email.toLowerCase();
    const exist = await User.findOne({ email });
    if (exist) {
      res.status(401).json({ msg: "User With This Email Already Exists!" });
    } else {
      const user = await User.create(req.body);
      await LikedJobs.create({
        user: user._id,
        JobOffer: [],
      });
      if (user) {
        res.status(201).json({
          name: user.name,
          email: user.email,
          token: generateToken(user._id, user.name),
        });
      } else {
        res.status(401).json({ msg: "Something Went Wrong!" });
      }
    }
  })
);
UserRoutes.post(
  "/login",
  asyncHandler(async (req, res) => {
    const emailf = req.body.email.toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({ email: emailf });

    if (user && password == user.password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id, user.name),
      });
    } else {
      res.status(401).json({ msg: "Invalid Email or Password !" });
    }
  })
);

UserRoutes.post(
  "/like/:id",
  protectEmpl,
  asyncHandler(async (req, res) => {
    const seekerId = req.params.id;
    try {
      const employer = await UsersLiked.findOne({
        jobOffer: req.body.jobOffer,
      });

      const exists = employer.users.find((user) => user.user == seekerId);
      if (exists) {
        return res.status(400).json({ message: "User already liked" });
      }
      const newUser = {
        user: seekerId,
        isMatch: false,
      };

      // Find the job seeker in the database
      const seeker = await LikedJobs.findOne({ user: seekerId });
      // Check if the job offer is liked by the user
      const exists2 = seeker.jobOffer.find(
        (offer) => offer.offer.toString() == employer.jobOffer.toString()
      );
      if (exists2) {
        // Update the match status of the job seeker
        const jobIndex = seeker.jobOffer.findIndex(
          (offer) => offer.offer.toString() === employer.jobOffer.toString()
        );
        newUser.isMatch = true;
        employer.users.push(newUser);
        seeker.jobOffer[jobIndex].isMatch = true;
        await employer.save();
        await seeker.save();
        res.status(200).json({ message: "It's a match!" });
      } else {
        // Save the updated employer to the database
        employer.users.push(newUser);
        await employer.save();
        res.status(200).json({ message: "User liked" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
//get user by id
UserRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    //get user by id
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  })
);
export default UserRoutes;
