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
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHotelData = void 0;
// HOTEL API 
const insertHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { hotel_name, hotel_star, hotel_address } = req.body;
        const files = req.files;
        //  Extract hotel images
        const hotelImages = files
            .filter((file) => file.fieldname === "hotel_images")
            .map((file) => file.path);
        //  Extract room images dynamically
        const hotelRooms = [];
        for (let i = 0; i < ((_a = req.body.hotelRooms) === null || _a === void 0 ? void 0 : _a.length) || 0; i++) {
            const roomImages = files
                .filter((file) => file.fieldname === `room_images_${i}`)
                .map((file) => file.path);
            hotelRooms.push({ roomIndex: i, roomImages });
        }
        console.log("hotelImages", hotelImages, "roomImages", hotelRooms);
    }
    catch (error) {
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
