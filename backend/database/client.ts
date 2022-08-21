import { Sequelize } from "sequelize-typescript";
import { Orders, Shops, User } from "./models";

export const sequelizeClient = new Sequelize('sqlite://database.db');

sequelizeClient.addModels([User, Shops, Orders]);