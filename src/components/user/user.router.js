import { Router } from "express";
import { isAuthenticated } from "./../../../middleware/auth.middleware.js";
import { globalCatch } from "./../../../utils/catchError.js";

import {
  deleteUser,
  updateUser,
  getAllUsers,
  filterUsers,
  getUserIn,
  countFemale,
  getAllMale,
} from "./user.controller.js";

const router = Router();

// delete user
router.delete("/", isAuthenticated, globalCatch(deleteUser));

// update user
router.patch("/", isAuthenticated, globalCatch(updateUser));

// get all users
router.get("/", globalCatch(getAllUsers));

// search users with name starts with x or age less than y
router.get("/filter", isAuthenticated, globalCatch(filterUsers));

// search users with name equal of any of given names
router.get("/names", isAuthenticated, globalCatch(getUserIn));

// count the female users
router.get("/countfemale", isAuthenticated, globalCatch(countFemale));

// get all male users
router.get("/male", isAuthenticated, globalCatch(getAllMale));

export default router;
