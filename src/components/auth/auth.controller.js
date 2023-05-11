import { User } from "./../../../DB/model/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResError } from "./../../../utils/errorClass.js";
import { sendEmail } from "./../../../utils/Emails/sendEmail.js";
dotenv.config();

////////////////////////////////// Registeration //////////////////////////////////
export const register = async (req, res, next) => {
  // get data from request
  const { userName, email, password, age, gender } = req.body;

  // check the user existence
  const existedUser = await User.findOne({ email });
  if (existedUser) return next(new ResError("Email already existed!", 401));

  // create confirmation code
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = new User({
    userName,
    email,
    password,
    age,
    gender,
    activationCode,
  });

  user.save((error) => {
    if (error) {
      return next(error);
    } else {
      // send email
      return sendEmail({
        to: user.email,
        subject: "Activate Account",
        activationCode,
      })
        ? res.status(201).json({ success: true })
        : next(new ResError("Something went wrong!", 400));
    }
  });
};

////////////////////////////////// Login //////////////////////////////////
export const login = async (req, res, next) => {
  // get data from request
  const { email, password } = req.body;
  if (!(email && password)) return next(new ResError("Data is required", 400));

  const user = await User.findOne({ email });
  // check user
  if (!user) return next(new ResError("Email is not found!", 400));

  // check activation
  if (!user.isConfirmed)
    return next(new ResError("Please activate your account!", 400));

  // check password
  const isMatch = user.checkPassword(password);
  if (!isMatch) return next(new ResError("Password is incorrect!", 400));

  // generate token
  const token = jwt.sign(
    { id: user._id, email: email },
    process.env.TOKEN_KEY,
    { expiresIn: "5m" }
  );
  console.log(jwt.verify(token, process.env.TOKEN_KEY));
  return res.json({ success: true, results: { token } });
};

////////////////////////////////// Activate Account //////////////////////////////////
export const activateAcc = async (req, res, next) => {
  const user = await User.updateOne(
    {
      activationCode: req.params.activationCode,
    },
    { isConfirmed: true, $unset: { activationCode: 1 } }
  );

  return user.matchedCount
    ? res.send("Congratulations, you account is now activated, try to login!")
    : next(new ResError("Account not found!"));
};
