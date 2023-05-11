import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "./../DB/model/user.model.js";
import { ResError } from "./../utils/errorClass.js";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  // chech token existence and type
  let token = req.headers["authorization"]; // Bearer token
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new ResError("Valid token is required!", 400));

  // check token
  token = token.split(process.env.BEARER_KEY)[1];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) return next(new ResError("Token is invalid!", 401));

  // check user existence
  const user = await User.findOne({ email: decoded.email });
  if (!user) return next(new ResError("User not found!", 400));

  // check if the account is active
  if (!user.isConfirmed)
    return next(new ResError("You should activate your account!", 400));

  req.decoded = { email: user.email, id: user._id, role: user.role }; //{id, email, role} user

  return next();
};
