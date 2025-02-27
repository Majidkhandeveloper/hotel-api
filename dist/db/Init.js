"use strict";
// import AddHotelRom from '../model/AddHotelRom';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddHotelDataModel_1 = __importDefault(require("../model/AddHotelDataModel"));
const AddRoomDataModel_1 = __importDefault(require("../model/AddRoomDataModel"));
// import SupplierCategoryModel from "../model/SupplierCategoryModel";
const isDev = process.env.NODE_ENV === "development";
const dbInit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield AddHotelDataModel_1.default.sync({ force: false });
        yield AddRoomDataModel_1.default.sync({ force: false });
        console.log('Database synchronization completed successfully.');
    }
    catch (error) {
        console.error('Error synchronizing the database:', error);
    }
});
exports.default = dbInit;
