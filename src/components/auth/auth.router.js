import { Router } from "express";
import { register, login, activateAcc } from "./auth.controller.js";
import { globalCatch } from "./../../../utils/catchError.js";
import { isValid } from "./../../../middleware/validation.middelware.js";
import { authLoginSchema, authRegisterSchema } from "./auth.validation.js";
const router = Router();

// sign up
router.post("/register", isValid(authRegisterSchema), globalCatch(register));

// sign in
router.post("/login", isValid(authLoginSchema), globalCatch(login));

// confirm email
router.get("/confirm/:activationCode", globalCatch(activateAcc));

export default router;
