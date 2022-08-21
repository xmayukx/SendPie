import { Column, Model, Table } from "sequelize-typescript";
import { DataTypes } from "sequelize";

@Table
export class User extends Model {
    @Column({primaryKey: true})
    username: string

    @Column
    password: string

    @Column
    email: string

    @Column
    currentLocation: string
}

@Table
export class Orders extends Model {
    @Column({primaryKey: true})
    orderId: string

    @Column(DataTypes.TEXT)
    orderData: string

    @Column
    byUsername: string

    @Column
    toBeDeliveredByUsername: string
}

@Table
export class Shops extends Model {
    @Column({primaryKey: true})
    shopName: string

    @Column
    shopLocation: string
}