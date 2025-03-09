"use strict";
// src/models/AddHotelData.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const AddRoomDataModel_1 = __importDefault(require("./AddRoomDataModel"));
class RoomImagesModel extends sequelize_1.Model {
}
RoomImagesModel.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    room_id: { type: sequelize_1.DataTypes.BIGINT },
    room_images: sequelize_1.DataTypes.STRING,
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "roomimages"
});
AddRoomDataModel_1.default.hasMany(RoomImagesModel, { foreignKey: "room_id", as: "room_images" });
RoomImagesModel.belongsTo(AddRoomDataModel_1.default, { foreignKey: "room_id", as: "hotel_rooms" });
exports.default = RoomImagesModel;
