// src/models/AddHotelModel.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";

export interface AddHotelModelProps {
    id?: number;
    hotel_name:string,
    hotel_star: string,
    hotel_address:string,
    hotel_country: string,
    hotel_contact:string,
    hotel_umrah_status: string,
    hotel_city: string,
}

class AddHotelModel extends Model<AddHotelModelProps> {}

AddHotelModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        // Required Fields
        hotel_name: { type: DataTypes.STRING, allowNull: false },
        hotel_star: { type: DataTypes.STRING, allowNull: false },

        // Optional Fields
        hotel_address: { type: DataTypes.STRING },
        hotel_country: { type: DataTypes.STRING },
        hotel_contact: { type: DataTypes.STRING },
        hotel_umrah_status: { type: DataTypes.STRING},
        hotel_city: { type: DataTypes.STRING},

    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "addhotel"
    }
);



export default AddHotelModel;
