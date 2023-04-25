import Jwt from "jsonwebtoken";

const generateToken = (_id, name) => {
  return Jwt.sign({ _id, name }, "HireHero", {
    expiresIn: "30d",
  });
};
export default generateToken;
