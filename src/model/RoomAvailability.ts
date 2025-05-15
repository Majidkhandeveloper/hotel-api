// src/models/HotelDataModel.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";

export interface RoomAvailabilityProps {
    id?: number;
    room_id: string;
    hotel_id: string;
    totalRooms: string;
    bookedRooms: string;
    is_aviabille: string;
    book_start_date: string; // use STRING
    book_end_date: string;   // use STRING
    agent_acc_id: number;
    pax_name: string;
    hname_typ_occ_rmid: string;
}

class RoomAvailability extends Model<RoomAvailabilityProps> { }

RoomAvailability.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        hotel_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        room_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
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
        book_start_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        book_end_date: {
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

export default RoomAvailability;
