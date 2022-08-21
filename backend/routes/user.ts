import { Request, Response } from "express";
import { createUser, fetchUser } from "../database/methods";
import { IsEmpty, IsValidUser } from "../validation/checks";
import { masterKey } from "../config.json";

export async function getUser(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const userToBeSearched = req.body.target;

    if (IsEmpty(username) || IsEmpty(password)) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        })
    }

    const isUserValid = await IsValidUser(username, password);
    if (!isUserValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid username or password"
        })
    }

    const user = await fetchUser(userToBeSearched);
    if (user == null) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }
    
    return res.status(200).json({
        success: true,
        message: "User found",
        username: user.username,
        email: user.email,
        currentLocation: user.currentLocation
    });
}

export async function addNewUser(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const key = req.body.key;

    if (IsEmpty(username) || IsEmpty(password) || IsEmpty(email) || IsEmpty(key)) {
        return res.status(400).json({
            success: false,
            message: "Username, password, email and key"
        })
    }

    if (key !== masterKey) {
        return res.status(400).json({
            success: false,
            message: "Invalid key"
        })
    }

    const user = await fetchUser(username);
    if (user !== null) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }

    const newUser = await createUser(username, password, email);
    return res.status(200).json({
        success: true,
        message: "User created",
        user: newUser.toJSON()
    });
}