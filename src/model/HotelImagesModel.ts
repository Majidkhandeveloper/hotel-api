// src/models/AddHotelData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";
import AddHotelDataModel from "./AddHotelDataModel";

export interface HotelImagesModelProps {
    id?: number;
    hotel_id:number;
    hotel_images:string;
}

class HotelImagesModel extends Model<HotelImagesModelProps> {}

HotelImagesModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        hotel_id: { type: DataTypes.BIGINT },
        hotel_images: DataTypes.STRING,

    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "hotelimages"
    }
);

AddHotelDataModel.hasMany(HotelImagesModel, { foreignKey: "hotel_id",as: "hotel_images",});
HotelImagesModel.belongsTo(AddHotelDataModel, { foreignKey: "hotel_id" , as: "hotel",});

export default HotelImagesModel;
