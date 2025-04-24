import { Router } from "express";
import Users from "../models/users.model";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import Habits from "../models/habits.model";
import { Request, Response } from "express";
import { generateToken } from "../libs/utils";
import { AuthRequest } from "../libs/types";
dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "Nokey";


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

    if(user){
      generateToken(user._id as string, user.UserEmail,res);
      await user.save();
      res.status(201).json({message: "User Created Successfully", New_User: user})
      return;
    }

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
        console.log("User Id: ", user._id);
        generateToken(user._id as string, user.UserEmail,res);
        res.status(200).json({message: "Signin Successful", User: user});
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


//?----------------------------------------------------------------------------


//! @name: UpdateProfile
//! @desc: Update user profile

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  
  try {
    const user = req.user;
    const { ProfileUrl } = req.body;

    console.log("User For token: ", user._id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // If a new profile picture is uploaded, update ProfileUrl to the new path
    let newProfileUrl = ProfileUrl; // Default to existing ProfileUrl or passed one
    
    if (req.file) {
      // If a file is uploaded, use the file path for ProfileUrl
      newProfileUrl = `/uploads/${req.file.filename}`;
    }

    // Update the user's profile with the new ProfileUrl
    const updatedUser = await Users.findByIdAndUpdate(
      user._id, 
      { ProfileUrl: newProfileUrl }, 
      { new: true }  // This ensures the updated document is returned
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Respond with the updated user
    res.status(200).json({
      message: "Profile updated successfully",
      User: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error", error_area: "Update Profile" });
  }
};


//?---------------------------------------------------------------------------------------------------

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


//----------------------------------------------------------------------------------------------

//! @name: UpdatePoint
//! @desc: update the points in the profile

export const UpdatePoint = async (req: AuthRequest, res: Response) => {
  const UserEmail = req.user.UserEmail;

  try {

    const userHabits = await Habits.find({ UserEmail });

    if (!userHabits) {
     res.status(404).json({ message: "No habits found for this user." });
     return ;
    }


    let totalPoints = 0;

    for (const habit of userHabits) {

      totalPoints += habit.HabitPoints || 0;
    }

    await Users.findOneAndUpdate(
      { UserEmail },
      { $set: { Points: totalPoints } },
      { new: true }
    );

    res.status(200).json({
      message: "User points updated successfully.",
      totalPoints,
    });

  } catch (error) {
    console.error("UpdatePoint error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export default router;