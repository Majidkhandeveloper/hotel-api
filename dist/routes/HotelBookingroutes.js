"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { userPermissions } from './../middleware/Permissions';
const express_1 = require("express");
const HotelBookingController_1 = require("../controllers/HotelBookingController");
const Uploads_1 = require("../utils/Uploads");
// import protect from "../middleware/AuthMiddleware";
const router = (0, express_1.Router)();
// HOTEL API
router.post("/insert-hotel-data", Uploads_1.UploadFiles, HotelBookingController_1.insertHotelData);
router.get("/get_hotel_data", HotelBookingController_1.getHotelData);
router.get('/get_single_hotel_data/:id', HotelBookingController_1.getSingleHotelData);
router.patch('/update_hotel_data/:id', Uploads_1.UploadFiles, HotelBookingController_1.updateHotelData);
router.delete('/delete_hotel_image/:id', Uploads_1.UploadFiles, HotelBookingController_1.DeleteHotelImage);
router.delete('/delete_room_image/:id', HotelBookingController_1.DeleteRoomImage);
router.patch('/update_hotel_status/:id', HotelBookingController_1.UpdateHotelStatus);
// get hotel data for umarah
router.get('/get-umrah-hotel', HotelBookingController_1.getUmrahHotelData);
// router.get('/hotel-data', getHotelData)
// router.get('/country-data', getCountryData)
// router.get('/city-data', getCityData)
exports.default = router;
