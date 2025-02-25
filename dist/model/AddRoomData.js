"use strict";
// src/models/AddRoomData.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class AddRoomData extends sequelize_1.Model {
}
AddRoomData.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    room_nature: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    room_type: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    room_occupancy: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    room_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    room_rates: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    room_plus_up: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    room_rate_start_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    room_rate_end_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    room_status: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    timestamps: false,
    sequelize: dbConfig_1.default,
    tableName: "addroomdata"
});
exports.default = AddRoomData;
