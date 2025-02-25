"use strict";
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
const AddHotelModel_1 = __importDefault(require("../model/AddHotelModel"));
const AddHotelRom_1 = __importDefault(require("../model/AddHotelRom"));
// import SupplierCategoryModel from "../model/SupplierCategoryModel";
const isDev = process.env.NODE_ENV === "development";
const dbInit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield AddHotelModel_1.default.sync({ force: false });
        yield AddHotelRom_1.default.sync({ force: false });
        console.log('Database synchronization completed successfully.');
    }
    catch (error) {
        console.error('Error synchronizing the database:', error);
    }
});
exports.default = dbInit;
