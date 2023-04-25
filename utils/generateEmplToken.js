import Jwt from "jsonwebtoken";

const generateEmplToken = (_id, name, role) => {
  return Jwt.sign({ _id, name, role }, "HireHero", {
    expiresIn: "30d",
  });
};
export default generateEmplToken;
