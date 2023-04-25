import express from "express";
import asyncHandler from "express-async-handler";
import Employer from "../Models/Employer.js";
import generateEmplToken from "../utils/generateEmplToken.js";
const EmployerRoutes = express.Router();

EmployerRoutes.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    email.toLowerCase();
    const exist = await Employer.findOne({ email });
    if (exist) {
      res.status(401).json({ msg: "Employer With This Email Already Exists!" });
    } else {
      const employer = await Employer.create(req.body);
      if (employer) {
        res.status(201).json({
          _id: employer._id,
          name: employer.name,
          email: employer.email,
          phone: employer.phone,
          role: "Employer",
          token: generateEmplToken(employer._id, employer.name, "Employer"),
        });
      } else {
        res.status(401).json({ msg: "Something Went Wrong!" });
      }
    }
  })
);
EmployerRoutes.post(
  "/login",
  asyncHandler(async (req, res) => {
    const emailf = req.body.email.toLowerCase();

    const password = req.body.password;
    const empl = await Employer.findOne({ email: emailf });

    if (empl && password == empl.password) {
      res.json({
        _id: empl._id,
        name: empl.name,
        email: empl.email,
        phone: empl.phone,
        role: "Employer",
        token: generateEmplToken(empl._id, empl.name, "Employer"),
      });
    } else {
      res.status(401).json({ msg: "Invalid Email or Password !" });
    }
  })
);
EmployerRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const empl = await Employer.findById(req.params.id);
    if (empl) {
      res.json(empl);
    } else {
      res.status(404).json({ msg: "Employer Not Found !" });
    }
  })
);
export default EmployerRoutes;
