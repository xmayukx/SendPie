import { genSalt, hash, compare } from 'bcrypt';
import { fetchUser } from '../database/methods';

export async function hashIt(password: string): Promise<string> {
    const salt = await genSalt(6);
    const hashed = await hash(password, salt);
    return hashed;
}

export async function IsValidUser(username: string, password: string): Promise<boolean> {
    const user = await fetchUser(username);
    if (user == null) {
        return false;
    }
    return await compare(password, user.password);
}

export function IsEmpty(obj: string): boolean {
    return (obj === undefined || obj === null || obj === "")
}