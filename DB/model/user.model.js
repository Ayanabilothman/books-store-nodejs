import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      min: 3,
      max: 10,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["Male", "Female"],
        message: "{VALUE} is not supported !",
      },
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    activationCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = bcrypt.hashSync(this.password, 10); // this >> document
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.checkPassword = function (Password) {
  return bcrypt.compareSync(Password, this.password) ? true : false;
};

// we can create custom hooks for any methods we create on schema
// userSchema.pre("checkPassword", function () {
//   console.log("Password confirmed from mongoose hooks!");
// });

export const User = model("User", userSchema);
