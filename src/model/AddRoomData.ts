// src/models/AddRoomData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";

export interface AddRoomDataProps {
    id?: number;
    room_nature: string;
    room_type: string;
    room_occupancy: string;
    room_quantity: number;
    room_rates: number;
    room_plus_up: number;
    room_rate_start_date: Date;
    room_rate_end_date: Date;
    room_status: boolean;
}

class AddRoomData extends Model<AddRoomDataProps> {}

AddRoomData.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        room_nature: { type: DataTypes.STRING, allowNull: false },
        room_type: { type: DataTypes.STRING, allowNull: false },
        room_occupancy: { type: DataTypes.STRING, allowNull: false },
        room_quantity: { type: DataTypes.INTEGER, allowNull: false },
        room_rates: { type: DataTypes.FLOAT, allowNull: false },
        room_plus_up: { type: DataTypes.FLOAT, allowNull: false },
        room_rate_start_date: { type: DataTypes.DATEONLY, allowNull: false },
        room_rate_end_date: { type: DataTypes.DATEONLY, allowNull: false },
        room_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "addroomdata"
    }
);

export default AddRoomData;
