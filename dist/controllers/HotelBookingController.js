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
exports.getCityData = exports.getCountryData = exports.getHotelData = void 0;
const sequelize_1 = require("sequelize");
const HotelDataModel_1 = __importDefault(require("../model/HotelDataModel"));
const CityModel_1 = __importDefault(require("../model/CityModel"));
// hotel data
const getHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const data = yield HotelDataModel_1.default.findAll({
            where: {
                name: {
                    [sequelize_1.Op.like]: `%${name}%`,
                },
            },
        });
        // return ResponseMessage(res,200,data);
    }
    catch (error) {
        // return ResponseMessage(res,200,undefined,"Data Get successfully");
    }
});
exports.getHotelData = getHotelData;
const getCountryData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const data = yield CityModel_1.default.findAll({
            where: {
                country_name: {
                    [sequelize_1.Op.like]: `%${name}%`,
                },
            },
            attributes: ['country_name', 'country_code'], // Only get the country_name column
            group: ['country_name'], // Group by country_name to get unique records
            // distinct: true, // Ensure unique values
        });
        // return ResponseMessage(res, 200, data);
    }
    catch (error) {
        // return ResponseMessage(res, 500, undefined, "Error getting data");
    }
});
exports.getCountryData = getCountryData;
const getCityData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code } = req.query;
        const whereCondition = Object.assign(Object.assign({}, (name && { city_name: { [sequelize_1.Op.like]: `%${name}%` } })), (code && { country_code: code }));
        const data = yield CityModel_1.default.findAll({
            where: whereCondition,
            attributes: ['city_name', 'country_code'], // Specify needed attributes
            group: ['city_name'], // Group by both to ensure uniqueness
            // distinct: true,
        });
        // return ResponseMessage(res, 200, data);
    }
    catch (error) {
        // return ResponseMessage(res, 500, undefined, "Error getting data");
    }
});
exports.getCityData = getCityData;
