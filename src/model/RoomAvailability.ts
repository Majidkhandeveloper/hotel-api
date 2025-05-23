// src/models/HotelDataModel.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";
import AddRoomDataModel from "./AddRoomDataModel";

export interface RoomAvailabilityProps {
    id?: number;
    room_id: string;
    hotel_id: string;
    totalRooms: string;
    bookedRooms: string;
    is_aviabille: string;
    book_start_end_date: string;
    roe: string;
    curr: string;
    rates: string;
    plus_up: string;
    agent_acc_id: number;
    pax_name: string;
    hname_typ_occ_rmid: string;
}

class RoomAvailability extends Model<RoomAvailabilityProps> { }

RoomAvailability.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        hotel_id: {
            type: DataTypes.BIGINT
        },
        room_id: { type: DataTypes.BIGINT },

        totalRooms: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hname_typ_occ_rmid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bookedRooms: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_aviabille: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        book_start_end_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roe: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        curr: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rates: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        plus_up: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        agent_acc_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pax_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: Connection,
        tableName: "room_availability",
        timestamps: false,
    }
);


AddRoomDataModel.hasMany(RoomAvailability, { foreignKey: "room_id" });
RoomAvailability.belongsTo(AddRoomDataModel, { foreignKey: "room_id" });

export default RoomAvailability;
