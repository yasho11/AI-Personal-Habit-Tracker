import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "Nokey";

interface CustomRequest extends Request {
  UserEmail?: string;
}

interface JwtPayload {
  email: string;
  id?: string;
}

//Middleware
export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token Required" });
    return;
  } else {
    console.log("Received token:", token);
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      console.log("Decoded Payload: ", decoded);
      req.UserEmail = decoded.email;
      next();
    } catch (error) {
      console.error("JWT verification error: ", error);
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
  }
};
