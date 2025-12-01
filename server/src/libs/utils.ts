import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (Userid: string, email: string, res: Response) => {
    const payload = {
        Userid,
        email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    // ✅ Fixed cookie settings for development
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "lax",  // ✅ Changed from "none" to "lax"
        secure: false,    // ✅ Keep false for localhost development
    });

    return token;
};