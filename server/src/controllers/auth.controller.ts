import { Router } from "express";
import Users from "../models/users.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Habits from "../models/habits.model";
import multer from "multer";
import path from "path";
import { protectRoute } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import { sign } from "crypto";
import { promises } from "dns";
dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "Nokey";

interface AuthRequest extends Request {
  user?: any;
}
//------ROUTER STARTS HERE----------------------------------------

//-------------------------------------------------------------

//! @name: signup
//! @desc: Register a new user
//! @access: Public

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { UserName, UserEmail, UserPassword } = req.body;
  const ProfileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Check if the email already exists
    if (await Users.findOne({ UserEmail })) {
       res.status(400).json({ message: "Email already taken!" });
      return;
      }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(UserPassword, salt);

    // Create the new user
    const user = new Users({
      UserEmail,
      UserName,
      UserPassword: passwordHash,
      Points: 0,
      ProfileUrl,
    });

    // Save the user to the database
    await user.save();
     res.status(201).json({ message: "User created successfully!" });
      return;
    } catch (error) {
    console.error(error);
     res.status(500).json({ error: "Server error"  , error_area: "signup"});
     return;
  }
};
//---------------------------------------------------------------------------------------------------------------

//! @name: signin
//! @desc: Login a user
//! @access: Public


export const signin = async (req: Request, res: Response): Promise<any> => {
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
    return res.status(500).json({ error: error.message , error_area: "signin"});
  }
};

//---------------------------------------------------------------------------------
//! @name: Signout:
//! @desc: Logout a user


export const signout = async (req: Request, res: Response): Promise<void>=>{
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message, error_area: "signout" });
  }
}


//----------------------------------------------------------------------------


//! @name: UpdateProfile
//! @desc: Update user profile


export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Fetch user from DB
    const existingUser = await Users.findById(user._id);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update Name if provided
    if (req.body.UpUserName) {
      existingUser.UserName = req.body.UpUserName;
    }

    // Update Password if provided
    if (req.body.UpUserPassword) {
      const salt = await bcryptjs.genSalt(10);
      existingUser.UserPassword = await bcryptjs.hash(req.body.UpUserPassword, salt);
    }

    // Update Profile Picture if uploaded
    if (req.file) {
      const profilePath = `/uploads/${req.file.filename}`;
      existingUser.ProfileUrl = profilePath;
    }

    // Save updated user
    await existingUser.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: existingUser._id,
        UserName: existingUser.UserName,
        UserEmail: existingUser.UserEmail,
        ProfileUrl: existingUser.ProfileUrl,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error", error_area: "Update Profile" });
  }
};

//---------------------------------------------------------------------------------------------------

//!name: getUser
//!desc: Get user details

export const getUser = async (req: AuthRequest, res: Response):  Promise<void> =>{
  try{
    const user = req.user;
    if(!user){
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    res.status(200).json({
      User: user
    })
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Internal Server Error",  error_area: "getUser"})
}

}


//---------------------------------------------------------------------------------------------------1

//! @name: checkAuth
//! @desc: Check if user is authenticated

export const checkAuth = async(req: AuthRequest, res:Response): Promise<void>=>{
  try{
    const user = req.user;
    if(!user){
      res.status(401).json({message: "Unauthorized"});
      return;

    }

    res.status(200).json({
      User: user
    })
  }catch(error){

    console.error(error);
    res.status(500).json({message: "Internal Server Error", error_area: "checkAuth"})
  }
}