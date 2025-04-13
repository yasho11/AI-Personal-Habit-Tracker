import { Router, Request, Response } from "express";
import Habits from "../models/habits.model";
import Users from "../models/users.model";
import mongoose from "mongoose";
import { AuthRequest } from "../libs/types";
const router = Router();





//?------------------------------------------------------------------------------------------------

//! @name: getHabits
//! @desc: Used to get a habit 


export const getHabits = async(req: AuthRequest, res: Response): Promise<void> =>{
  const UserEmail = req.user.UserEmail;
  if(UserEmail){
    try {
      const habits = await Habits.find({UserEmail})

      res.status(201).json({Habits: habits});
    } catch (error:any) {
        res.status(400) .json({message: error.message || "Something went wrong!"});

    }
  }else{
    res.status(404).json({message: "Token not decoded: "});
  }
}



//?-------------------------------------------------------------------------------------------------------

//! @name: CreateHabit
//! @desc: Uses to add new habit


export const createHabit = async(req: AuthRequest , res: Response) =>{
  const UserEmail = req.user.UserEmail;
  const {HabitName, HabitDesc = "" ,  HabitPoints, HabitStreak = 0, Status = "Not Done"} = req.body;

  if(!HabitName || HabitPoints === undefined){
    res.status(400).json({error: "Both Habit Name and Habit Points are required!"});

  }else if(!UserEmail){
    res.status(401).json({error: "User Email not found in token!"});
  }else{
    try{
      const newHabit = new Habits({
        HabitName,
        HabitDesc,
        HabitPoints,
        UserEmail,
        Status: "Not Done",
      });
      await newHabit.save();
      res.status(201).json({message: "New habit created!" , habit:newHabit})
    }catch(error:any){
      console.error("Error creating a habit: ", error);
      res.status(500).json({error: "Internal server error"});
    }
  
  }
  
}


//------------------------------------------------------------------------------------------------\

//! @name: editHabit
//! @desc: Use to edit habit

export const editHabit = async (req: AuthRequest, res: Response):Promise<any> => {
  const UserEmail = req.user.UserEmail;
  const id = req.params.id;
  console.log("Update Habit triggered");

  const { HabitName, HabitDesc, HabitPoints, Status } = req.body;

  if (!UserEmail) {
    return res.status(400).json({ message: "User Email not found in token" });
  }

  try {
    const habitData: any = {};

    if (HabitName) habitData.HabitName = HabitName;
    if (HabitDesc) habitData.HabitDesc = HabitDesc;
    if (HabitPoints !== undefined) habitData.HabitPoints = HabitPoints;
    if (Status) habitData.Status = Status;

    const updatedHabit = await Habits.findOneAndUpdate(
      { _id: id }, // or { HabitId: id } based on your schema
      { $set: habitData },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.status(200).json({
      message: "Habit Updated Successfully",
      Habits: updatedHabit,
    });

  } catch (error: any) {
    console.error("Error updating Habits:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//---------------------------------------------------------------------------------------


//! @name: Delete Habit
//! @desc: this is used to delete habits 

export const deleteHabit = async(req: AuthRequest, res: Response) =>{
    const UserEmail = req.user.UserEmail;
    const id = req.params.id;

    if(!UserEmail){
      res.status(400).json({message: "User Email not found"});
      return;
    }else{
      try{
        const habit = await Habits.findByIdAndDelete(id);
        res.status(200).json({message: "Habit Deleted successfully", habit})
      }catch(error: any){
        console.error("Error deleting habit: ", error);
        res
        .status(500)
        .json({message: "Internal server error: ", error: error.message});

      }
    }
}

//-------------------------------------------------------------------------------------------

//! @name: Update streak
//! @desc: this is used to update the streak


export const updateStreak = async(req: AuthRequest, res: Response)=>{
  const UserEmail = req.user.UserEmail;
  const id = req.params.id;
  const {Status} = req.body;
  const today = new Date();

  if(!UserEmail) {
    res
    .status(401)
    .json({error: "Email is empty! Need Token to proceed"});
    return;
  } 
  if(!id || !Status){
    res
    .status(428)
    .json({error: "Status and Id for the habit required"});
    return;
  }
  if(!mongoose.Types.ObjectId.isValid(id)){
    res
    .status(400)
    .json({error: "Invalid habit ID"});
  }
  try {
    const habit = await Habits.findById(id);
    if(!habit){
      res
      .status(404)
      .json({error: "Habit Not found"});
      return;
    }

    let updatedStreak = habit.HabitStreak;
    let lastCompleted = habit.LastCompleted;
    let streakDiff = 0;

    if(Status === "Done"){
      if(lastCompleted){
        const lastDate = new Date(lastCompleted);
        const diffDays = Math.floor((today.getTime() - lastDate.getTime())/(1000 * 60 * 60 * 24));
        if(diffDays === 1){
          streakDiff = 1;
          updatedStreak += 1;
        }else if(diffDays > 1){
          updatedStreak = 0
        }else{
          updatedStreak = 1;
          streakDiff = 1;
        }
        lastCompleted = today;
      }else {
        updatedStreak = 1;
        streakDiff = 1;
        lastCompleted = today;
      }

      const upHabit = await Habits.findByIdAndUpdate(
        id,
        {
          $set: {
            Status: Status,
            HabitStreak: updatedStreak,
            LastCompleted: lastCompleted,
          },
        },
        {new: true}
      );

      const user = await Users.findOne({ UserEmail: UserEmail});
      if(user && streakDiff > 0){
        const habitPoints = habit.HabitPoints || 0;
        const additionalPoints = streakDiff * habitPoints;

        await Users.updateOne(
        {UserEmail: UserEmail},
        {$inc: {Points: additionalPoints}})
      };

      res
      .status(200)
      .json({
        message: "Habit updated successfully",
        updatedHabit: upHabit,
      });
    }

  } catch (error) {
    console.error("Error updating habit status: ", error);
    res
    .status(500)
    .json({error: "Internal Server Error"});
    
  }
}

//-----------------------------------------------------------------------------

//! @name: getHabit
//! @desc: Function to get a single habit

export const getHabit = async(req:AuthRequest , res: Response)=> {
  const habitId = req.params.id;

  try {
    if(!habitId){
      res
      .status(400)
      .json({error: "Habit not found"});
      return;
    }else{
      const habit = await Habits.findById(habitId);

      if(!habit){
        res.status(400).json({error: "Habit not found"});
        return;
      }else{
        res.status(200).json({message: "Habit found", habit})
      }
    }

  } catch (error) {
    console.error("Error updating habit status: ", error);
    res
    .status(500)
    .json({error: "Internal Server Error"})

    return;
  }
}

//?----------------------------------------------------------------------------------------------

//! @name: searchHabits
//! @desc: Searching for habits

export const searchHabits = async (req: AuthRequest, res: Response) => {
  const UserEmail = req.user.UserEmail;
  const searchTerm = req.query.searchTerm as string; 
  try {
    const query: any = { UserEmail };

    if (searchTerm) {
      query.HabitName = { $regex: searchTerm, $options: "i" }; // Search by habit name
    }

    const habits = await Habits.find(query);

    res.status(200).json({
      success: true,
      habits,
    });
  } catch (error) {
    console.error("Search Habits error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch habits",
    });
  }
};


export default router;
