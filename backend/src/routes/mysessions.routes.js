import express from "express";
import {
  getMySessions,
  getSessionById,
  saveDraftSession,
  publishSession,
  deleteSession, 
} from "../controllers/mysessions.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getMySessions);
router.get("/:id", getSessionById);
router.post("/save-draft", saveDraftSession);
router.post("/publish", publishSession);
router.delete("/:id", deleteSession); 

export default router;
