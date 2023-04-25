import express from "express";
import asyncHandler from "express-async-handler";
import protectEmpl from "../Middleware/emplAuth.js";
import Company from "../Models/Company.js";
import protect from "../Middleware/userAuth.js";
const CompanyRoutes = express.Router();

CompanyRoutes.post(
  "/add",

  asyncHandler(async (req, res) => {
    const { name } = req.body;
    name.toLowerCase();
    const exists = await Company.findOne({ name });
    if (exists) {
      res.status(401).json({ msg: "Company Already Exists In Our Database!" });
    } else {
      const company = await Company.create(req.body);
      if (company) {
        res.status(201).json({
          _id: company._id,
          name: company.name,
          location: company.location,
          description: company.description,
          website: company.website,
          image: company.image,
          field: company.field,
          msg: "Company Added Successfully!",
        });
      } else {
        res.status(400).json({ msg: "Invalid Company Data!" });
      }
    }
  })
);
CompanyRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const companies = await Company.find();
    if (companies) {
      res.status(200).json(companies);
    } else {
      res.status(404).json({ msg: "No Companies Found!" });
    }
  })
);

CompanyRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ msg: "No Company Found!" });
    }
  })
);

export default CompanyRoutes;
