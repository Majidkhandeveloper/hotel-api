// src/models/AddHotelRom.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";
import AddHotelModel from "./AddHotelModel";

export interface AddHotelRomProps {
    id?: number;
    hotel_id:number;
    room_nature:string ,
    room_type: string,
    room_occupancy:string,
    room_quantity:string,
    room_rates: string,
    room_plus_up: string,
    room_rate_start_date: string,
    room_rate_end_date: string,
    room_status: string,
}

class AddHotelRom extends Model<AddHotelRomProps> {}

AddHotelRom.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        hotel_id: { type: DataTypes.BIGINT },

        // Required Fields
        room_nature: { type: DataTypes.STRING, allowNull: false },
        room_type: { type: DataTypes.STRING, allowNull: false },

        room_occupancy: { type: DataTypes.STRING, allowNull: false },

        // Optional Fields
        room_quantity: { type: DataTypes.STRING },
        room_rates: { type: DataTypes.STRING },
        room_plus_up: { type: DataTypes.STRING },
        room_rate_start_date: { type: DataTypes.STRING},
        room_rate_end_date: { type: DataTypes.STRING},
        room_status: { type: DataTypes.STRING},


    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "addhotelroom"
    }
);

AddHotelModel.hasMany(AddHotelRom, { foreignKey: "hotel_id" }); 
AddHotelRom.belongsTo(AddHotelModel, { foreignKey: "hotel_id" });

export default AddHotelRom;
