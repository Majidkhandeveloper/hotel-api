// src/models/AddHotelData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";

export interface AddHotelDataProps {
    id?: number;
    code: string;
    name: string;
    countryCode: string;
    destinationCode: string;
    city: string;
    description: string;
}

class AddHotelData extends Model<AddHotelDataProps> {}

AddHotelData.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

        // Required Fields
        code: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },

        // Optional Fields
        countryCode: { type: DataTypes.STRING },
        destinationCode: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT },
    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "hotelapi"
    }
);



export default AddHotelData;
