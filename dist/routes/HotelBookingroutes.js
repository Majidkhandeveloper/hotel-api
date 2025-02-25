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
// router.get('/hotel-data', getHotelData)
// router.get('/country-data', getCountryData)
// router.get('/city-data', getCityData)
exports.default = router;
