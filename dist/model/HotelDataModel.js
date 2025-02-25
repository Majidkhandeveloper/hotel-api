"use strict";
// src/models/HotelDataModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class HotelDataModel extends sequelize_1.Model {
}
HotelDataModel.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // Required Fields
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    // Optional Fields
    countryCode: { type: sequelize_1.DataTypes.STRING },
    destinationCode: { type: sequelize_1.DataTypes.STRING },
    city: { type: sequelize_1.DataTypes.STRING },
    description: { type: sequelize_1.DataTypes.TEXT },
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "hotelapi"
});
exports.default = HotelDataModel;
