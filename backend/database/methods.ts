import { hashIt } from "../validation/checks";
import { Orders, User } from "./models";
import { v4 as uuidv4 } from 'uuid';

export async function createNewOrder(byUsername: string, data: any) {
    const orderId = uuidv4();
    return await Orders.create({
        orderId: orderId,
        byUsername: byUsername,
        orderData: JSON.stringify(data)
    })
}

export async function updateDeliveryPersonByOrderId(orderId: string, deliveryPerson: string) {
    return await Orders.update({
        toBeDeliveredByUsername: deliveryPerson
    }, {
        where: {
            orderId: orderId
        }
    })
}

export async function fetchOrderById(orderId: string) {
    const data = await Orders.findByPk(orderId);
    if (data == null) {
        return null
    }
    return {
        orderId: data?.orderId,
        orderData: JSON.parse(data!.orderData),
        toBeDeliveredByUsername: data.toBeDeliveredByUsername,
        byUsername: data.byUsername
    }
}

export async function fetchUser(username: string) {
    return await User.findByPk(username);
}

export async function createUser(username: string, password: string, email: string) {
    const hashedPasswd = await hashIt(password);
    return await User.create({
        username: username,
        password: hashedPasswd,
        email: email
    });
}

export async function updateUserLocation(username: string, location: string) {
    return await User.update({
        currentLocation: location
    }, {
        where: {
            username: username
        }
    });
}

export async function fetchAllOrders(){
    return await Orders.findAll();
}