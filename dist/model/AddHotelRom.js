"use strict";
// src/models/AddHotelRom.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const AddHotelModel_1 = __importDefault(require("./AddHotelModel"));
class AddHotelRom extends sequelize_1.Model {
}
AddHotelRom.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    hotel_id: { type: sequelize_1.DataTypes.BIGINT },
    // Required Fields
    room_nature: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    room_type: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    room_occupancy: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    // Optional Fields
    room_quantity: { type: sequelize_1.DataTypes.STRING },
    room_rates: { type: sequelize_1.DataTypes.STRING },
    room_plus_up: { type: sequelize_1.DataTypes.STRING },
    room_rate_start_date: { type: sequelize_1.DataTypes.STRING },
    room_rate_end_date: { type: sequelize_1.DataTypes.STRING },
    room_status: { type: sequelize_1.DataTypes.STRING },
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "addhotelroom"
});
AddHotelModel_1.default.hasMany(AddHotelRom, { foreignKey: "hotel_id" });
AddHotelRom.belongsTo(AddHotelModel_1.default, { foreignKey: "hotel_id" });
exports.default = AddHotelRom;
