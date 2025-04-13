import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import {getHabits, createHabit, editHabit, deleteHabit, updateStreak, getHabit, searchHabits} from '../controllers/habit.controller';
import {recommend} from "../controllers/recommend.controller";

const router = express.Router();


router.get("/viewHabit" , protectRoute , getHabits);
router.post("/create", protectRoute, createHabit);
router.put("/edit/:id" , protectRoute, editHabit);
router.delete("/delete/:id", protectRoute, deleteHabit);
router.get("/getHabit/:id", protectRoute, getHabit);
router.put("/upStreak/:id", protectRoute, updateStreak);
router.get("/search", protectRoute, searchHabits);
router.get("/recommend/:id", protectRoute , recommend);

export default router;
