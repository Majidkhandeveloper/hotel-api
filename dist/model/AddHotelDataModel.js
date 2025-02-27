"use strict";
// src/models/AddHotelData.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class AddHotelDataModel extends sequelize_1.Model {
}
AddHotelDataModel.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    hotel_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    hotel_star: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    hotel_address: { type: sequelize_1.DataTypes.STRING },
    hotel_country: { type: sequelize_1.DataTypes.STRING },
    hotel_contact: { type: sequelize_1.DataTypes.STRING },
    hotel_umrah_status: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    hotel_city: { type: sequelize_1.DataTypes.STRING },
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "addhoteldata"
});
exports.default = AddHotelDataModel;
