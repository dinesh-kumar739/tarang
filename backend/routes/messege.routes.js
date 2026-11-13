import express from "express";
import {sendMessege,getMesseges,getAllUsers} from "../controller/messege.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/users",isAuthenticated,getAllUsers);
router.get("/:id",isAuthenticated,getMesseges);
router.post("/send/:id",isAuthenticated,sendMessege);

export default router;