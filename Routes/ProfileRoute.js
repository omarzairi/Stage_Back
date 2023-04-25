import express from "express";
import asyncHandler from "express-async-handler";
import protectEmpl from "../Middleware/emplAuth.js";
import protect from "../Middleware/userAuth.js";
import Profile from "../Models/Profile.js";
import UsersLiked from "../Models/usersLiked.js";

const ProfileRoute = express.Router();

ProfileRoute.get(
  "/user",
  protect,
  asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user });
    if (!profile) {
      res.status(401).json({ msg: "Profile Not Found!" });
    }
    res.status(200).json(profile);
  })
);
ProfileRoute.get(
  "/userex",
  protect,
  asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user });
    if (!profile) {
      return false;
    }
    return true;
  })
);

ProfileRoute.get(
  "/employer",
  protectEmpl,
  asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.employer });
    if (!profile) {
      res.status(401).json({ msg: "Profile Not Found!" });
    }
    res.status(200).json(profile);
  })
);
ProfileRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.params.id });
    if (!profile) {
      res.status(401).json({ msg: "Profile Not Found!" });
    }
    res.status(200).json(profile);
  })
);
ProfileRoute.put(
  "/user",
  protect,
  asyncHandler(async (req, res) => {
    const { image, location, skills, education, experience, profession } =
      req.body;

    try {
      const profile = await Profile.findOne({ user: req.user._id });
      profile.image = image || profile.image;
      profile.location = location || profile.location;
      profile.skills = skills || profile.skills;
      profile.education = education || profile.education;
      profile.experience = experience || profile.experience;
      profile.profession = profession || profile.profession;

      const updt = await profile.save();

      res.status(200).json({
        user: updt.user,
        image: updt.image,
        location: updt.location,
        skills: updt.skills,
        education: updt.education,
        experience: updt.experience,
        joinedAt: updt.joinedAt,
        profession: updt.profession,
        message: "Profile updated successfully",
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
ProfileRoute.put(
  "/employer",
  protectEmpl,
  asyncHandler(async (req, res) => {
    const { image, location, skills, education, experience, profession } =
      req.body;

    try {
      const profile = await Profile.findOne({ user: req.employer._id });
      profile.image = image || profile.image;
      profile.location = location || profile.location;
      profile.skills = skills || profile.skills;
      profile.education = education || profile.education;
      profile.experience = experience || profile.experience;
      profile.profession = profession || profile.profession;
      const updt = await profile.save();

      res.status(200).json({
        user: updt.user,
        image: updt.image,
        location: updt.location,
        skills: updt.skills,
        education: updt.education,
        experience: updt.experience,
        joinedAt: updt.joinedAt,
        profession: updt.profession,
        message: "Profile updated successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  })
);

ProfileRoute.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user });
    if (profile) {
      return res.status(400).json({ msg: "Profile already exists!" });
    }
    const newProfile = await Profile.create({
      user: req.user,
      image: req.body.image,
      location: req.body.location,
      skills: req.body.skills,
      education: req.body.education,
      experience: req.body.experience,
      profession: req.body.profession,
      joinedAt: new Date(),
    });
    if (newProfile) {
      res.status(200).json(newProfile);
    } else {
      res.status(400).json({ msg: "Something went wrong!" });
    }
  })
);
ProfileRoute.post(
  "/employer",
  protectEmpl,
  asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.employer });
    if (profile) {
      return res.status(400).json({ msg: "Profile already exists!" });
    }
    const newProfile = await Profile.create({
      user: req.employer,
      image: req.body.image,
      profession: req.body.profession,
      location: req.body.location,
      skills: req.body.skills,
      education: req.body.education,
      experience: req.body.experience,
      joinedAt: new Date(),
    });
    if (newProfile) {
      res.status(200).json(newProfile);
    } else {
      res.status(400).json({ msg: "Something went wrong!" });
    }
  })
);
//get by searching profession
ProfileRoute.get(
  "/search/:profession",
  asyncHandler(async (req, res) => {
    const profile = await Profile.find({
      $text: {
        $search: req.params.profession,
      },
    });
    if (!profile) {
      res.status(401).json({ msg: "Profile Not Found!" });
    }
    res.status(200).json(profile);
  })
);

//get liked seekers by joboffer id
ProfileRoute.get(
  "/liked/:id",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const liked = await UsersLiked.findOne({ jobOffer: req.params.id });
      if (!liked) {
        res.status(401).json({ msg: "No liked users found!" });
      }
      res.status(200).json(liked);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

export default ProfileRoute;
