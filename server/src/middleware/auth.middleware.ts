import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.model";
import { Types } from "mongoose";
import { IUsers } from "../models/users.model";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "Nokey";


interface AuthRequest extends Request {
  user?: any;
}


export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const decoded = jwt.verify(token, secret as string) as { Userid: string };

    if (!decoded || !decoded.Userid) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }


    if (!Types.ObjectId.isValid(decoded.Userid)) {
      res.status(401).json({ message: "Invalid User Id" });
      return;
    }

    const userObj = new Types.ObjectId(decoded.Userid);

    const user = await User.findById(userObj).select("-UserPassword");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error: ", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

}