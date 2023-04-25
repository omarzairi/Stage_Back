import express from "express";
import asyncHandler from "express-async-handler";
import protectEmpl from "../Middleware/emplAuth.js";
import protect from "../Middleware/userAuth.js";
import JobOffer from "../Models/JobOffer.js";
import Employer from "../Models/Employer.js";
import LikedJobs from "../Models/likedJobs.js";
import UsersLiked from "../Models/usersLiked.js";
import Message from "../Models/Message.js";
const MessageRoute = express.Router();

MessageRoute.post(
  "/senduser",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const from = req.user._id;
      const to = req.body.to;
      const message = await Message.create({
        message: { text: req.body.message },
        sender: req.user._id,
        users: [from.toString(), to.toString()],
      });
      if (message) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

MessageRoute.post(
  "/sendemployer",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const from = req.body.from;
      const to = req.body.to;
      const message = await Message.create({
        message: { text: req.body.message },
        sender: req.body.from,
        users: [from.toString(), to.toString()],
      });
      if (message) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

// async (req, res, next) => {
//     try {
//       const { from, to } = req.body;

//       const messages = await Messages.find({
//         users: {
//           $all: [from.toString(), to.toString()],
//         },
//       }).sort({ updatedAt: 1 });

//       const projectedMessages = messages.map((msg) => {
//         return {
//           fromSelf: msg.sender.toString() === from,
//           message: msg.message.text,
//         };
//       });
//       res.json(projectedMessages);
//     } catch (ex) {
//       next(ex);
//     }
//   };
//get messages with a post request
MessageRoute.post(
  "/getmessages",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const from = req.user._id;
      const to = req.body.to;
      const messages = await Message.find({
        users: {
          $all: [from.toString(), to.toString()],
        },
      }).sort({ updatedAt: 1 });
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from.toString(),
          message: msg.message.text,
        };
      });
      res.json(projectedMessages);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

MessageRoute.post(
  "/getmessagesemployer",
  protectEmpl,
  asyncHandler(async (req, res) => {
    try {
      const from = req.body.from;
      const to = req.body.to;
      const messages = await Message.find({
        users: {
          $all: [from.toString(), to.toString()],
        },
      }).sort({ updatedAt: 1 });
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
      res.json(projectedMessages);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

export default MessageRoute;
