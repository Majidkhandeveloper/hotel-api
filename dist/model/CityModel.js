"use strict";
// src/models/CityModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class CityModel extends sequelize_1.Model {
}
CityModel.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // Required Fields
    country_code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    country_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    // Optional Fields
    city_code: { type: sequelize_1.DataTypes.STRING },
    city_name: { type: sequelize_1.DataTypes.STRING },
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "cities"
});
exports.default = CityModel;
