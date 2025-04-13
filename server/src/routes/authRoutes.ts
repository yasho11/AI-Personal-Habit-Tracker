import express from 'express';
import multer from 'multer';
import path from 'path';
import {getUser, signin, signup, signout, updateProfile, checkAuth, UpdatePoint} from '../controllers/auth.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// 2. Create multer instance with file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // ✅ 10 MB limit
  },
});


router.post("/signup", upload.single("ProfileUrl"), signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/updateProfile", upload.single("ProfileUrl"), protectRoute,updateProfile);
router.get("/view", protectRoute, getUser);
router.get("/check", protectRoute, checkAuth);
router.get("/UpdatePoints", protectRoute, UpdatePoint)
export default router;




