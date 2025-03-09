"use strict";
// src/models/AddHotelData.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const AddHotelDataModel_1 = __importDefault(require("./AddHotelDataModel"));
class HotelImagesModel extends sequelize_1.Model {
}
HotelImagesModel.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    hotel_id: { type: sequelize_1.DataTypes.BIGINT },
    hotel_images: sequelize_1.DataTypes.STRING,
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "hotelimages"
});
AddHotelDataModel_1.default.hasMany(HotelImagesModel, { foreignKey: "hotel_id", as: "hotel_images", });
HotelImagesModel.belongsTo(AddHotelDataModel_1.default, { foreignKey: "hotel_id", as: "hotel", });
exports.default = HotelImagesModel;
