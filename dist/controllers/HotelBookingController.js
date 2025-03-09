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
exports.updateHotelData = exports.getSingleHotelData = exports.getHotelData = exports.insertHotelData = void 0;
const AddHotelDataModel_1 = __importDefault(require("../model/AddHotelDataModel"));
const AddRoomDataModel_1 = __importDefault(require("../model/AddRoomDataModel"));
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const HotelImagesModel_1 = __importDefault(require("../model/HotelImagesModel"));
const RoomImagesModel_1 = __importDefault(require("../model/RoomImagesModel"));
const HotelFacilitiesModel_1 = __importDefault(require("../model/HotelFacilitiesModel"));
const RoomFacilitiesModel_1 = __importDefault(require("../model/RoomFacilitiesModel"));
// HOTEL API 
const insertHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield dbConfig_1.default.transaction(); // Start transaction
    try {
        const _b = req.body, { hotelRooms, hotel_facilities, hotel_umrah_status } = _b, hotelDetails = __rest(_b, ["hotelRooms", "hotel_facilities", "hotel_umrah_status"]);
        const files = req.files;
        // Extract hotel images
        const hotelImages = ((_a = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === "hotel_images")) === null || _a === void 0 ? void 0 : _a.map((file) => file.filename)) || [];
        // Extract room images dynamically
        const RoomsImages = [];
        if (hotelRooms && Array.isArray(hotelRooms)) {
            hotelRooms.forEach((_, i) => {
                var _a;
                const roomImages = ((_a = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === `room_images_${i}`)) === null || _a === void 0 ? void 0 : _a.map((file) => file.filename)) || [];
                RoomsImages.push({ roomIndex: i, roomImages });
            });
        }
        // Insert hotel data with transaction
        const hotelData = yield AddHotelDataModel_1.default.create(hotelDetails, { transaction });
        const hotelId = hotelData.dataValues.id; // Get the inserted hotel ID
        // Insert hoteliImages
        if (hotelImages.length > 0) {
            yield HotelImagesModel_1.default.bulkCreate(hotelImages.map((imagePath) => ({
                hotel_id: hotelId,
                hotel_images: imagePath,
            })), { transaction });
        }
        // Extract valid facilities (convert object to array)
        if (hotel_facilities && typeof hotel_facilities === "object") {
            const facilitiesEntries = Object.entries(hotel_facilities)
                .filter(([key, value]) => {
                return value === true || value === "true"; // Handle boolean or string
            })
                .map(([key]) => ({
                hotel_id: hotelId,
                facility: key,
            }));
            if (facilitiesEntries.length > 0) {
                yield HotelFacilitiesModel_1.default.bulkCreate(facilitiesEntries, { transaction });
            }
            else {
                console.log("No valid facilities to insert.");
            }
        }
        const roomBody = hotelRooms.map((rm) => (Object.assign(Object.assign({}, rm), { hotel_id: hotelId, room_rate_start_date: new Date(rm.room_rate_start_date).toISOString().split("T")[0], room_rate_end_date: new Date(rm.room_rate_end_date).toISOString().split("T")[0] })));
        // Insert room data
        const roomData = yield AddRoomDataModel_1.default.bulkCreate(roomBody, { transaction });
        // Insert room images
        const roomImageEntries = roomData.flatMap((room, index) => {
            var _a;
            const roomImages = ((_a = RoomsImages.find((ri) => ri.roomIndex === index)) === null || _a === void 0 ? void 0 : _a.roomImages) || [];
            return roomImages.map((imagePath) => ({
                room_id: room.id, // Get room ID from createdRooms
                room_images: imagePath,
            }));
        });
        if (roomImageEntries.length > 0) {
            yield RoomImagesModel_1.default.bulkCreate(roomImageEntries, { transaction });
        }
        const roomFacilitiesEntries = roomData.flatMap((room, index) => {
            const originalRoom = hotelRooms[index]; // Match the original room by index
            if (originalRoom && originalRoom.room_facilities && typeof originalRoom.room_facilities === "object") {
                return Object.entries(originalRoom.room_facilities)
                    .filter(([_, value]) => {
                    return value === true || value === "true"; // Handle boolean or string
                }) // Keep only true values
                    .map(([facility]) => ({
                    room_id: room.id, // Assign correct room_id from roomData
                    facility: facility
                }));
            }
            return [];
        });
        // Save to database
        if (roomFacilitiesEntries.length > 0) {
            yield RoomFacilitiesModel_1.default.bulkCreate(roomFacilitiesEntries, { transaction });
        }
        yield transaction.commit();
        res.status(201).json({
            message: "Hotel and rooms added successfully",
        });
    }
    catch (error) {
        yield transaction.rollback();
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
});
exports.insertHotelData = insertHotelData;
const getHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield AddHotelDataModel_1.default.findAll();
        // Send response
        return res.status(200).json({
            success: true,
            message: "Hotels retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error fetching hotel data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getHotelData = getHotelData;
const getSingleHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Ensure ID is a number (if your database requires it)
        const hotelId = parseInt(id);
        if (isNaN(hotelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID",
            });
        }
        // Fetch the hotel with its related models
        const data = yield AddHotelDataModel_1.default.findOne({
            include: [
                {
                    model: HotelFacilitiesModel_1.default,
                    as: "hotel_facilities",
                    attributes: ['facility']
                },
                {
                    model: HotelImagesModel_1.default,
                    as: "hotel_images",
                    attributes: ["hotel_images"]
                },
                {
                    model: AddRoomDataModel_1.default,
                    as: "hotel_rooms",
                    include: [
                        {
                            model: RoomFacilitiesModel_1.default,
                            as: "room_facilities"
                        },
                        {
                            model: RoomImagesModel_1.default,
                            as: "room_images"
                        }
                    ]
                },
            ],
            where: { id: hotelId },
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Hotel retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error fetching single hotel data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getSingleHotelData = getSingleHotelData;
const updateHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const transaction = yield dbConfig_1.default.transaction();
    try {
        const { id } = req.params;
        const _d = req.body, { hotelRooms, hotel_facilities, hotel_umrah_status } = _d, hotelDetails = __rest(_d, ["hotelRooms", "hotel_facilities", "hotel_umrah_status"]);
        const files = req.files;
        // console.log("hotelDetails",req.body,"id",id);
        const hotelId = parseInt(id);
        if (isNaN(hotelId)) {
            return res.status(400).json({ success: false, message: "Invalid hotel ID" });
        }
        // Check if hotel exists
        const existingHotel = yield AddHotelDataModel_1.default.findByPk(hotelId);
        if (!existingHotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        console.log("existingHotel", existingHotel);
        // Update hotel details
        yield AddHotelDataModel_1.default.update(hotelDetails, { where: { id: hotelId }, transaction });
        // Extract hotel images
        const hotelImages = ((_c = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === "hotel_images")) === null || _c === void 0 ? void 0 : _c.map((file) => file.filename)) || [];
        const existingImages = yield HotelImagesModel_1.default.findAll({
            where: { hotel_id: hotelId },
            attributes: ["hotel_images"],
        });
        const existingImagePaths = existingImages.map((img) => img.hotel_images);
        // Merge old and new images
        const updatedImages = [...existingImagePaths, ...hotelImages];
        // Insert only **new images** (prevent duplicates)
        const newImagesToInsert = hotelImages.filter(img => !existingImagePaths.includes(img));
        // Remove old images and insert new ones
        if (hotelImages.length > 0) {
            yield HotelImagesModel_1.default.destroy({ where: { hotel_id: hotelId }, transaction });
            yield HotelImagesModel_1.default.bulkCreate(updatedImages.map((imagePath) => ({
                hotel_id: hotelId,
                hotel_images: imagePath,
            })), { transaction });
        }
        // Update Hotel Facilities
        if (hotel_facilities && typeof hotel_facilities === "object") {
            const facilitiesEntries = Object.entries(hotel_facilities)
                .filter(([key, value]) => {
                return value === true || value === "true"; // Handle boolean or string
            })
                .map(([key]) => ({
                hotel_id: hotelId,
                facility: key,
            }));
            yield HotelFacilitiesModel_1.default.destroy({ where: { hotel_id: hotelId }, transaction });
            if (facilitiesEntries.length > 0) {
                yield HotelFacilitiesModel_1.default.bulkCreate(facilitiesEntries, { transaction });
            }
        }
        // Handle Room Updates
        if (hotelRooms && Array.isArray(hotelRooms)) {
            yield AddRoomDataModel_1.default.destroy({ where: { hotel_id: hotelId }, transaction });
            const roomData = yield AddRoomDataModel_1.default.bulkCreate(hotelRooms.map((rm) => (Object.assign(Object.assign({}, rm), { hotel_id: hotelId, room_rate_start_date: new Date(), room_rate_end_date: new Date() }))), { transaction, returning: true });
            // Extract room images dynamically
            const RoomsImages = [];
            hotelRooms.forEach((_, i) => {
                var _a;
                const roomImages = ((_a = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === `room_images_${i}`)) === null || _a === void 0 ? void 0 : _a.map((file) => file.filename)) || [];
                RoomsImages.push({ roomIndex: i, roomImages });
            });
            // Insert room images
            const roomImageEntries = roomData.flatMap((room, index) => {
                var _a;
                const roomImages = ((_a = RoomsImages.find((ri) => ri.roomIndex === index)) === null || _a === void 0 ? void 0 : _a.roomImages) || [];
                return roomImages.map((imagePath) => ({
                    room_id: room.id,
                    room_images: imagePath,
                }));
            });
            yield RoomImagesModel_1.default.destroy({ where: { room_id: roomData.map((room) => room.id) }, transaction });
            if (roomImageEntries.length > 0) {
                yield RoomImagesModel_1.default.bulkCreate(roomImageEntries, { transaction });
            }
            // Update Room Facilities
            const roomFacilitiesEntries = roomData.flatMap((room, index) => {
                const originalRoom = hotelRooms[index];
                if ((originalRoom === null || originalRoom === void 0 ? void 0 : originalRoom.room_facilities) && typeof originalRoom.room_facilities === "object") {
                    return Object.entries(originalRoom.room_facilities)
                        .filter(([_, value]) => value === true || value === "true")
                        .map(([facility]) => ({
                        room_id: room.id,
                        facility: facility,
                    }));
                }
                return [];
            });
            yield RoomFacilitiesModel_1.default.destroy({ where: { room_id: roomData.map((room) => room.id) }, transaction });
            if (roomFacilitiesEntries.length > 0) {
                yield RoomFacilitiesModel_1.default.bulkCreate(roomFacilitiesEntries, { transaction });
            }
        }
        yield transaction.commit();
        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Error updating hotel:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateHotelData = updateHotelData;
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
