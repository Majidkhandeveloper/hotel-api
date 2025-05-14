"use strict";
// src/models/HotelDataModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class RoomAvailability extends sequelize_1.Model {
}
RoomAvailability.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    room_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    totalRooms: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hname_typ_occ_rmid: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bookedRooms: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    is_aviabille: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    book_start_date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    book_end_date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    agent_acc_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    pax_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: dbConfig_1.default,
    tableName: "room_availability",
    timestamps: false,
});
exports.default = RoomAvailability;
