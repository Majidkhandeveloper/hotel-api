// src/models/AddHotelData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";
import AddHotelDataModel from "./AddHotelDataModel";
import AddRoomDataModel from "./AddRoomDataModel";

export interface RoomFacilitiesModelProps {
    id?: number;
    room_id:number;
    facility:string;
}

class RoomFacilitiesModel extends Model<RoomFacilitiesModelProps> {}

RoomFacilitiesModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        room_id: { type: DataTypes.BIGINT },
        facility: DataTypes.STRING,

    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "roomfacilities"
    }
);

AddRoomDataModel.hasMany(RoomFacilitiesModel, { foreignKey: "room_id",as:"room_facilities"});
RoomFacilitiesModel.belongsTo(AddRoomDataModel, { foreignKey: "room_id" ,as:"hotel_rooms"});

export default RoomFacilitiesModel;
