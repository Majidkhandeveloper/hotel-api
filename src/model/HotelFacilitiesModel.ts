// src/models/AddHotelData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";
import AddHotelDataModel from "./AddHotelDataModel";

export interface HotelFacilitiesModelProps {
    id?: number;
    hotel_id:number;
    facility:string;
}

class HotelFacilitiesModel extends Model<HotelFacilitiesModelProps> {}

HotelFacilitiesModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        hotel_id: { type: DataTypes.BIGINT },
        facility: DataTypes.STRING,

    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "hotelfacilities"
    }
);

AddHotelDataModel.hasMany(HotelFacilitiesModel, { foreignKey: "hotel_id", as: "hotel_facilities" });
HotelFacilitiesModel.belongsTo(AddHotelDataModel, { foreignKey: "hotel_id", as: "hotel" });

export default HotelFacilitiesModel;
