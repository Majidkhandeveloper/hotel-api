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
exports.DeleteRoomImage = exports.UpdateHotelStatus = exports.DeleteHotelImage = exports.updateHotelData = exports.getUmrahHotelData = exports.getSingleHotelData = exports.getHotelData = exports.insertHotelData = void 0;
const sequelize_1 = require("sequelize");
const AddHotelDataModel_1 = __importDefault(require("../model/AddHotelDataModel"));
const AddRoomDataModel_1 = __importDefault(require("../model/AddRoomDataModel"));
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const HotelImagesModel_1 = __importDefault(require("../model/HotelImagesModel"));
const RoomImagesModel_1 = __importDefault(require("../model/RoomImagesModel"));
const HotelFacilitiesModel_1 = __importDefault(require("../model/HotelFacilitiesModel"));
const RoomFacilitiesModel_1 = __importDefault(require("../model/RoomFacilitiesModel"));
const RoomAvailability_1 = __importDefault(require("../model/RoomAvailability"));
const moment_1 = __importDefault(require("moment"));
// HOTEL API 
const insertHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield dbConfig_1.default.transaction(); // Start transaction
    try {
        const _b = req.body, { hotelRooms, hotel_facilities } = _b, hotelDetails = __rest(_b, ["hotelRooms", "hotel_facilities"]);
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
        const hotelData = yield AddHotelDataModel_1.default.create(Object.assign(Object.assign({}, hotelDetails), { cur_label: hotelRooms.at(0).cur_label, currency: hotelRooms.at(0).currency, roe: hotelRooms.at(0).roe }), { transaction });
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
        const roomDataArray = {
            roomData: roomData,
            hotelId: hotelData.dataValues.id,
            hotelName: hotelData.dataValues.hotel_name,
        };
        generateAvailabilityForRooms(roomDataArray);
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
const generateAvailabilityForRooms = (roomDataArray) => __awaiter(void 0, void 0, void 0, function* () {
    const allRecords = [];
    for (const data of roomDataArray.roomData) {
        const typeObj = {
            Standard: "STD",
            Deluxe: "DLX",
            Suite: "SUI",
            Executive: "EXE",
            Superior: "Sup"
        };
        const occupancyObj = {
            Single: "SIN",
            Double: "DBL",
            Triple: "TRI",
            Quad: "QUA",
            Twin: "TWN"
        };
        const startDate = (0, moment_1.default)(data.room_rate_start_date, 'YYYY-MM-DD');
        const endDate = (0, moment_1.default)(data.room_rate_end_date, 'YYYY-MM-DD');
        const quantity = parseInt(data.room_quantity);
        const roomTypeShort = typeObj[data.room_type];
        const occShort = occupancyObj[data.room_occupancy];
        const hotelName = roomDataArray.hotelName;
        const hotelId = roomDataArray.hotelId;
        for (let roomIndex = 1; roomIndex <= quantity; roomIndex++) {
            const roomNumber = String(roomIndex).padStart(2, '0'); // e.g., 01, 02
            const current = startDate.clone();
            while (current.isSameOrBefore(endDate)) {
                const formattedDay = current.format('DD');
                const formattedMonth = current.format('MM');
                const formattedYear = current.format('YY');
                const hname_typ_occ_rmid = `${hotelName}-${roomTypeShort}—${occShort}-${roomNumber}-${formattedDay}-${formattedMonth}-${formattedYear}`;
                allRecords.push({
                    room_id: data.id.toString(),
                    hotel_id: hotelId,
                    hname_typ_occ_rmid,
                    totalRooms: "",
                    bookedRooms: "",
                    is_aviabille: "",
                    book_start_date: "",
                    book_end_date: "",
                    agent_acc_id: 0,
                    pax_name: "",
                });
                current.add(1, 'day');
            }
        }
    }
    yield RoomAvailability_1.default.bulkCreate(allRecords);
    console.log(`✅ Inserted ${allRecords.length} room availability records`);
});
const getHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield AddHotelDataModel_1.default.findAll({
            include: [
                {
                    model: HotelImagesModel_1.default,
                    as: "hotel_images",
                    attributes: ['hotel_images']
                }
            ],
            order: [["id", "DESC"]],
        });
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
                    attributes: ["id", "hotel_images"]
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
                            as: "room_images",
                            // attributes: ["id","hotel_images"]
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
// export const getUmrahHotelData = async (req: Request, res: Response) => {
//   try {
//     // Ensure ID is a number (if your database requires it)
//     // Fetch the hotel with its related models
//     const data = await AddHotelDataModel.findAll({
//       include: [
//         {
//           model: HotelFacilitiesModel,
//           as: "hotel_facilities",
//           attributes: ['facility']
//         },
//         {
//           model: HotelImagesModel,
//           as: "hotel_images",
//           attributes: ["id", "hotel_images"]
//         },
//         {
//           model: AddRoomDataModel,
//           as: "hotel_rooms",
//           include: [
//             {
//               model: RoomFacilitiesModel,
//               as: "room_facilities"
//             },
//             {
//               model: RoomImagesModel,
//               as: "room_images",
//               // attributes: ["id","hotel_images"]
//             }
//           ]
//         },
//       ],
//       where: { hotel_umrah_status:1 },
//     });
//     if (!data) {
//       return res.status(404).json({
//         success: false,
//         message: "Hotel not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Hotel retrieved successfully",
//       data,
//     });
//   } catch (error) {
//     console.error("Error fetching single hotel data:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };
const getUmrahHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { check_in_date, check_out_date } = req.query; // Get from request query params
        if (!check_in_date || !check_out_date) {
            return res.status(400).json({
                success: false,
                message: "Check-in and Check-out dates are required.",
            });
        }
        // Fetch the hotels where check-in and check-out dates are within the specified range
        const data = yield AddHotelDataModel_1.default.findAll({
            include: [
                {
                    model: HotelFacilitiesModel_1.default,
                    as: "hotel_facilities",
                    attributes: ["facility"],
                },
                {
                    model: HotelImagesModel_1.default,
                    as: "hotel_images",
                    attributes: ["id", "hotel_images"],
                },
                {
                    model: AddRoomDataModel_1.default,
                    as: "hotel_rooms",
                    include: [
                        {
                            model: RoomFacilitiesModel_1.default,
                            as: "room_facilities",
                        },
                        {
                            model: RoomImagesModel_1.default,
                            as: "room_images",
                        },
                    ],
                    where: {
                        room_rate_start_date: {
                            [sequelize_1.Op.lte]: check_out_date, // Room check-in date should be before or on check-out date
                        },
                        room_rate_end_date: {
                            [sequelize_1.Op.gte]: check_in_date, // Room check-out date should be after or on check-in date
                        },
                    },
                },
            ],
            where: { hotel_umrah_status: 1 },
        });
        if (!data.length) {
            return res.status(404).json({
                success: false,
                message: "No hotels found for the given date range",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Hotels retrieved successfully",
            data,
        });
    }
    catch (error) {
        console.error("Error fetching Umrah hotel data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getUmrahHotelData = getUmrahHotelData;
const updateHotelData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const transaction = yield dbConfig_1.default.transaction();
    try {
        const { id } = req.params;
        const _d = req.body, { hotelRooms, hotel_facilities } = _d, hotelDetails = __rest(_d, ["hotelRooms", "hotel_facilities"]);
        const files = req.files;
        const hotelId = parseInt(id);
        if (isNaN(hotelId)) {
            return res.status(400).json({ success: false, message: "Invalid hotel ID" });
        }
        // Check if hotel exists
        const existingHotel = yield AddHotelDataModel_1.default.findOne({
            where: { id: hotelId }, // Correct placement of where condition
            include: [
                {
                    model: HotelFacilitiesModel_1.default,
                    as: "hotel_facilities",
                    attributes: ["facility"],
                },
                {
                    model: HotelImagesModel_1.default,
                    as: "hotel_images",
                    attributes: ["id", "hotel_images"],
                },
                {
                    model: AddRoomDataModel_1.default,
                    as: "hotel_rooms",
                    include: [
                        {
                            model: RoomFacilitiesModel_1.default,
                            as: "room_facilities",
                        },
                        {
                            model: RoomImagesModel_1.default,
                            as: "room_images",
                            attributes: ["id", "room_images"], // Uncommented attributes
                        },
                    ],
                },
            ],
        });
        if (!existingHotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
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
            const roomData = yield AddRoomDataModel_1.default.bulkCreate(hotelRooms.map((rm) => (Object.assign(Object.assign({}, rm), { hotel_id: hotelId }))), { transaction, returning: true });
            const roomDataArray = {
                roomData: roomData,
                hotelId: existingHotel.dataValues.id,
                hotelName: existingHotel.dataValues.hotel_name,
            };
            generateAvailabilityForRooms(roomDataArray);
            /////////////////////////////////////////////////////////////////////////////////////room images//////////////////////////////////
            const existingRoomImages = yield RoomImagesModel_1.default.findAll({
                where: { room_id: existingHotel.hotel_rooms.map((room) => room.id) },
                attributes: ["room_id", "room_images"],
            });
            const existingImagesMap = {};
            // Assign images to their original index
            existingHotel.hotel_rooms.forEach((room, index) => {
                existingImagesMap[index] = existingRoomImages
                    .filter((img) => img.room_id === room.id)
                    .map((img) => img.room_images);
            });
            // Step 2: Extract new images uploaded for each room
            const RoomsImages = [];
            hotelRooms.forEach((_, i) => {
                var _a;
                const roomImages = ((_a = files === null || files === void 0 ? void 0 : files.filter((file) => file.fieldname === `room_images_${i}`)) === null || _a === void 0 ? void 0 : _a.map((file) => file.filename)) || [];
                RoomsImages.push({ roomIndex: i, roomImages });
            });
            // Step 3: Merge existing & new images for each room (Avoid Duplicates)
            const roomImageEntries = roomData.flatMap((room, index) => {
                var _a;
                // Get old images based on the index
                const oldImages = existingImagesMap[index] || [];
                // Get new images uploaded for this room
                const newImages = ((_a = RoomsImages.find((ri) => ri.roomIndex === index)) === null || _a === void 0 ? void 0 : _a.roomImages) || [];
                // Only add new images that are not already in the DB
                const uniqueNewImages = newImages.filter((img) => !oldImages.includes(img));
                return [...oldImages, ...uniqueNewImages].map((imagePath) => ({
                    room_id: room.id, // Assign the new room ID here
                    room_images: imagePath,
                }));
            });
            // Step 4: Remove Old Images and Insert Updated Ones
            yield RoomImagesModel_1.default.destroy({
                where: { room_id: existingHotel.hotel_rooms.map((room) => room.id) },
                transaction,
            });
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
const DeleteHotelImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteResult = yield HotelImagesModel_1.default.destroy({
            where: { id: id },
        });
        if (deleteResult === 0) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.status(200).json({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting hotel image:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.DeleteHotelImage = DeleteHotelImage;
const UpdateHotelStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { hotel_status } = req.body;
        const updateResult = yield AddHotelDataModel_1.default.update({ hotel_status }, { where: { id } });
        if (updateResult[0] === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json({ message: "Hotel status updated successfully", hotel_status });
    }
    catch (error) {
        console.error("Error updating hotel status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.UpdateHotelStatus = UpdateHotelStatus;
const DeleteRoomImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteResult = yield RoomImagesModel_1.default.destroy({
            where: { id: id },
        });
        if (deleteResult === 0) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.status(200).json({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting hotel image:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.DeleteRoomImage = DeleteRoomImage;
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
