import express from "express";
import { getPublicSessions } from "../controllers/sessions.controller.js";

const router = express.Router();

router.get("/", getPublicSessions);

export default router;
