import { Request, Response } from "express";
import { createNewOrder, fetchAllOrders, fetchOrderById, fetchUser, updateDeliveryPersonByOrderId } from "../database/methods";
import { IsEmpty, IsValidUser } from "../validation/checks";

export async function makeOrder(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const data = req.body.data;

    if (IsEmpty(username) || IsEmpty(password) || IsEmpty(data)) {
        return res.status(400).json({
            success: false,
            message: "Username, password and data are required"
        })
    }

    const isUserValid = await IsValidUser(username, password);
    if (!isUserValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid username or password"
        })
    }

    const order = await createNewOrder(username, data);
    const fetchedOrder = await fetchOrderById(order.orderId);
    return res.status(200).json(fetchedOrder);
}

export async function getOrder(req: Request, res: Response) {
    // console.log(req.body);
    const orderId = req.body.orderId;

    if (IsEmpty(orderId)) {
        return res.status(400).json({
            success: false,
            message: "order id required"
        })
    }

    const order = await fetchOrderById(orderId);
    if (order == null) {
        return res.status(404).json({
            success: false,
            message: "order not found"
        })
    }

    return res.status(200).json({
        success: true,
        order: order
    });
}

export async function updateDeliveryPerson(req: Request, res: Response) {
    const orderId = req.body.orderId;
    const personUsername = req.body.personUsername;

    if (IsEmpty(orderId) || IsEmpty(personUsername)) {
        return res.status(400).json({
            success: false,
            message: "order id and username required"
        })
    }

    const person = await fetchUser(personUsername);
    if (person === null) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    const order = await fetchOrderById(orderId);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: "order not found"
        })
    }

    await updateDeliveryPersonByOrderId(orderId, personUsername);
    return res.status(200).json({
        success: true,
        message: "order updated",
        order: await fetchOrderById(orderId)
    })
}

export async function getallOrders(req: Request, res: Response) {
    const key = req.body.key;
    if (IsEmpty(key)) {
        return res.status(400).json({
            success: false,
            message: "key is required"
        })
    }

    const orders = await fetchAllOrders();
    const jsonString: any[] = [];
    orders.map((value) => jsonString.push(value.toJSON()))
    return res.status(200).json(jsonString);
}

export async function getMatchingOrder(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const destination = req.body.destination;

    if (IsEmpty(username) || IsEmpty(password) || IsEmpty(destination)) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        })
    }

    const user = await fetchUser(username);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    const orders = await fetchAllOrders();
    const jsonString: any[] = [];
    orders.map((value) => {
        const data = JSON.parse(JSON.parse(value!.orderData));
        console.log(data);
        console.log(data.shopLocation);
        console.log(data.customerLocation);
        if (data.shopLocation !== undefined && data.customerLocation !== undefined
            && data.shopLocation.toLowerCase().includes(user.currentLocation.toLowerCase())
            && data.customerLocation.toLowerCase().includes(destination.toLowerCase())) {
            jsonString.push({
                orderId: value!.orderId,
                orderData: JSON.parse(value!.orderData),
                byUsername: value!.byUsername,
                toBeDeliveredByUsername: value!.toBeDeliveredByUsername,
            })
        }
    })
    return res.status(200).json(jsonString);
}