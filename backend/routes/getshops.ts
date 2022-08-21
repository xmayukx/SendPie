import { Request, Response } from "express";
import data from "../dummyData.json";

export async function getShops(req: Request, res: Response) {
    return res.status(200).json(data)
}