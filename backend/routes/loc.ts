import { Request, Response } from "express";
import { fetchUser, updateUserLocation } from "../database/methods";
import { IsEmpty, IsValidUser } from "../validation/checks";

export async function updateLocation(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const location = req.body.location;

    if (IsEmpty(username) || IsEmpty(password) || IsEmpty(location)) {
        return res.status(400).json({
            success: false,
            message: "Username, password and location are required"
        })
    }

    const isUserValid = await IsValidUser(username, password);
    if (!isUserValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid username or password"
        })
    }

    await updateUserLocation(username, location);
    return res.status(200).json({
        success: true,
        message: "Location updated",
        user: await fetchUser(username)
    });
}