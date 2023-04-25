import Jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Employer from "../Models/Employer.js";
const protectEmpl = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decrypt = Jwt.verify(token, "HireHero");
      req.employer = await Employer.findById(decrypt._id).select("-password");
      if (decrypt.role == "Employer") {
        next();
      } else {
        res.status(401).json({
          msg: "Sorry This Function Is Only For Employers Log In With An Employer Account!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ msg: "Sorry not authorized Login or Register !" });
    }
  }
  if (!token) {
    res.status(401).json({ msg: "Sorry not authorized Login or Register !" });
  }
});
export default protectEmpl;
