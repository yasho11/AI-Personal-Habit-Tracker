import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (Userid: string, email: string, res: Response) => {
    const payload = {
        Userid,
        email,
       
    };

    const token = jwt.sign(payload, process.env.SecretKey as string, { // This generates the token
        expiresIn: "7d",
    });

    res.cookie("jwt", token, { // This sets the cookie in the browser
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        sameSite: "strict",
        secure: false, // Set to true in production (when using HTTPS)
    });

    return token;
};
