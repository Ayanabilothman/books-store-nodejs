import { User } from "./../../../DB/model/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// delete user
export const deleteUser = async (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  const user = await User.findByIdAndDelete(id);
  return res.json({ message: "success", results: user });
};

// update user
export const updateUser = async (req, res) => {
  const id = req.decoded.id;
  const { firstName } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { firstName }, { new: true });
    return res.json({ message: "success", results: user });
  } catch (error) {
    return res.json({ error });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("articles");
    return res.json({ message: "success", results: users });
  } catch (error) {
    return res.json({ error: error.stack });
  }
};

// name starts with x or age less than y
export const filterUsers = async (req, res) => {
  const { age, char } = req.query;

  const pattern = new RegExp(`^${char}`, "i");
  const users = await User.find({
    $or: [{ age: { $lt: age } }, { firstName: { $regex: pattern } }],
  });
  return res.json({ message: "success", results: users });
};

// get user in certain values
export const getUserIn = async (req, res) => {
  const { name1, name2 } = req.query;
  console.log(name1, name2);

  const users = await User.find({
    firstName: { $in: [name1.toLowerCase(), name2.toLowerCase()] },
  });
  return users.length
    ? res.json({ message: "success", results: users })
    : res.json({ error: "Users not found!" });
};

// count female
export const countFemale = async (req, res) => {
  const female = await User.find({ gender: "Female" }).count();
  return res.json({ message: "success", results: female });
};

// get males
export const getAllMale = async (req, res) => {
  const males = await User.find({ gender: "Male" });
  return res.json({ message: "success", results: males });
};
