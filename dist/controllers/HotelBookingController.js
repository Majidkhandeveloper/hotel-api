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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHotelData = void 0;
const AddHotelDataModel_1 = __importDefault(require("../model/AddHotelDataModel"));
const AddRoomDataModel_1 = __importDefault(require("../model/AddRoomDataModel"));
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
// HOTEL API 
const insertHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield dbConfig_1.default.transaction(); // Start transaction
    try {
        const _b = req.body, { hotelRooms, hotel_facilities, hotel_umrah_status } = _b, hotelDetails = __rest(_b, ["hotelRooms", "hotel_facilities", "hotel_umrah_status"]);
        const files = req.files;
        // Extract hotel images
        const hotelImages = ((_a = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === "hotel_images")) === null || _a === void 0 ? void 0 : _a.map((file) => file.path)) || [];
        // Extract room images dynamically
        const RoomsImages = [];
        if (hotelRooms && Array.isArray(hotelRooms)) {
            hotelRooms.forEach((_, i) => {
                var _a;
                const roomImages = ((_a = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === `room_images_${i}`)) === null || _a === void 0 ? void 0 : _a.map((file) => file.path)) || [];
                RoomsImages.push({ roomIndex: i, roomImages });
            });
        }
        // Insert hotel data with transaction
        const hotelData = yield AddHotelDataModel_1.default.create(hotelDetails, { transaction });
        const hotelId = hotelData.dataValues.id; // Get the inserted hotel ID
        const roomBody = hotelRooms.map((rm) => (Object.assign(Object.assign({}, rm), { hotel_id: hotelId, room_rate_start_date: new Date(rm.room_rate_start_date).toISOString().split("T")[0], room_rate_end_date: new Date(rm.room_rate_end_date).toISOString().split("T")[0] })));
        // Insert room data
        yield AddRoomDataModel_1.default.bulkCreate(roomBody, { transaction });
        yield transaction.commit();
        res.status(201).json({
            message: "Hotel and rooms added successfully",
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.log("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
});
exports.insertHotelData = insertHotelData;
// hotel data
// export const getHotelData = async (req: Request, res: Response) => {
//   try {
//     const name = req.query.name;
//     const data = await HotelDataModel.findAll({
//       where: {
//         name:
//         {
//           [Op.like]: `%${name}%`,
//         },
//       },
//     });
//     // return ResponseMessage(res,200,data);
//   } catch (error) {
//     // return ResponseMessage(res,200,undefined,"Data Get successfully");
//   }
// };
// export const getCountryData = async (req: Request, res: Response) => {
//   try {
//     const name = req.query.name;
//     const data = await CityModel.findAll({
//       where: {
//         country_name: {
//           [Op.like]: `%${name}%`,
//         },
//       },
//       attributes: ['country_name', 'country_code'], // Only get the country_name column
//       group: ['country_name'], // Group by country_name to get unique records
//       // distinct: true, // Ensure unique values
//     }) as any;
//     // return ResponseMessage(res, 200, data);
//   } catch (error) {
//     // return ResponseMessage(res, 500, undefined, "Error getting data");
//   }
// };
// export const getCityData = async (req: Request, res: Response) => {
//   try {
//     const { name, code } = req.query;
//     const whereCondition = {
//       ...(name && { city_name: { [Op.like]: `%${name}%` } }),
//       ...(code && { country_code: code }), // Exact match for code
//     } as any;
//     const data = await CityModel.findAll({
//       where: whereCondition,
//       attributes: ['city_name', 'country_code'], // Specify needed attributes
//       group: ['city_name'], // Group by both to ensure uniqueness
//       // distinct: true,
//     }) as any;
//     // return ResponseMessage(res, 200, data);
//   } catch (error) {
//     // return ResponseMessage(res, 500, undefined, "Error getting data");
//   }
// };
