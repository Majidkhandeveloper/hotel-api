// src/models/AddHotelData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";
import AddRoomDataModel from "./AddRoomDataModel";

export interface RoomImagesModelProps {
    id?: number;
    room_id:number;
    room_images:string;
}

class RoomImagesModel extends Model<RoomImagesModelProps> {}

RoomImagesModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        room_id: { type: DataTypes.BIGINT },
        room_images: DataTypes.STRING,

    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "roomimages"
    }
);

AddRoomDataModel.hasMany(RoomImagesModel, { foreignKey: "room_id",as:"room_images"});
RoomImagesModel.belongsTo(AddRoomDataModel, { foreignKey: "room_id" ,as:"hotel_rooms"});

export default RoomImagesModel;
