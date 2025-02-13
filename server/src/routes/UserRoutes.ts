import { Router } from "express";
import Users from "../models/Users";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Habits from "../models/Habits";
import multer from "multer";
import path from "path";
import { verifyToken } from "../middleware/verifyToken";
import { Request, Response } from "express";
dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "Nokey";

interface CustomRequest extends Request {
  UserEmail?: string;
}

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

const upload = multer({
  storage: storage,
});

//------ROUTER STARTS HERE----------------------------------------
router.get("/getallusers", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
//-------------------------------------------------------------

router.post(
  "/createUsers",
  upload.single("ProfilePicture"),
  async (req, res) => {
    const { UserName, UserEmail, UserPassword } = req.body;
    const ProfileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      if (await Users.findOne({ UserEmail })) {
        res.status(400).json({ message: "Email already taken!" });
      } else {
        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(UserPassword, salt);

        const user = new Users({
          UserEmail,
          UserName,
          UserPassword: passwordHash,
          Points: 0,
          ProfileUrl,
        });

        await user.save();
        res.status(201).json({ message: "User created successfully!" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

//----------------------------------------------------------------------------------------------------------
router.get("/getUser", verifyToken, async (req: CustomRequest, res) => {
  const UserEmail = req.UserEmail;

  try {
    const user = await Users.findOne({ UserEmail });
    res.status(200).json({ message: "Succefully got the user profile!", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

//---------------------------------------------------------------------------------------------------------------

router.post("/login", async (req, res): Promise<any> => {
  const { UserEmail, UserPassword } = req.body;

  // Check if fields are empty
  if (!UserEmail || !UserPassword) {
    return res.status(400).json({ message: "Fill all the required fields" });
  }

  try {
    // Find the user
    const user = await Users.findOne({ UserEmail });

    if (!user) {
      return res.status(400).json({ message: "Please create an account!" });
    } else {
      // Compare passwords
      const isMatch = await bcryptjs.compare(UserPassword, user.UserPassword);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      } else {
        // Retrieve all habits for the user
        const habits = await Habits.find({ UserEmail });

        // Calculate total points based on habit streaks and points
        let totalPoints = 0;
        habits.forEach((habit) => {
          totalPoints += habit.HabitPoints * habit.HabitStreak;
        });

        // Update the user's points
        user.Points = totalPoints;
        await user.save();

        // Generate JWT token (expires in 1 day)
        const token = jwt.sign(
          { id: user._id, email: user.UserEmail },
          JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            UserName: user.UserName,
            UserEmail: user.UserEmail,
            Points: user.Points, // Send updated points back to the client
          },
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

//--------------------------------------------------------
router.get(
  "/UserProfile",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const UserEmail = req.UserEmail;

    if (!UserEmail) {
      res.status(400).json({ message: "User email not found" });
    }

    try {
      const user = await Users.findOne({ UserEmail });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User profile fetched successfully", user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//---------------------------------------------------------------------------------

//@desc: Update user profile
//@Acc: Protected (Requires Token)
router.patch(
  "/UpdateUser",
  verifyToken,
  upload.single("ProfilePicture"),
  async (req: CustomRequest, res): Promise<void> => {
    try {
      const user = await Users.findOne({ UserEmail: req.UserEmail });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update Name if provided
      if (req.body.UpUserName) {
        user.UserName = req.body.UpUserName;
      }

      // Update Password if provided
      if (req.body.UpUserPassword) {
        const salt = await bcryptjs.genSalt(10);
        user.UserPassword = await bcryptjs.hash(req.body.UpUserPassword, salt);
      }

      // Update Profile Picture if provided
      if (req.file) {
        const ProfileUrl = req.file ? `/uploads/${req.file.filename}` : null;
        if (ProfileUrl) {
          user.ProfileUrl = ProfileUrl;
        }
      }

      await user.save();
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

//------------------------------------------------------------------------------------------

//@desc: Delete User
//@Access: Private
router.post("/delete-account", verifyToken, async (req: CustomRequest, res) => {
  const { password } = req.body;
  try {
    const user = await Users.findOne({ UserEmail: req.UserEmail });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const isMatch = await bcryptjs.compare(password, user.UserPassword);
      if (!isMatch) {
        res.status(400).json({ message: "Incorrect password" });
      } else {
        await Users.findOneAndDelete({ UserEmail: req.UserEmail });
        res.json({ success: true, message: "Account deleted successfully" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//------------------------------------------------------------------------------------------

router.post(
  "/verify-password",
  verifyToken,
  async (req: CustomRequest, res) => {
    const { password } = req.body;

    try {
      const user = await Users.findOne({ UserEmail: req.UserEmail });

      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        const isMatch = await bcryptjs.compare(password, user.UserPassword);
        if (!isMatch)
          res
            .status(400)
            .json({ success: false, message: "Incorrect password" });

        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

export default router;
