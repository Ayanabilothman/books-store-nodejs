import { ResError } from "./../utils/errorClass.js";

export const isAdmin = async (req, res, next) => {
  return req.decoded.role !== "admin"
    ? next(new ResError("You aren't authorized to take this action!", 403))
    : next();
};
