// import { userPermissions } from './../middleware/Permissions';
import { Router } from "express";
import {   insertHotelData } from "../controllers/HotelBookingController";
import { UploadFiles } from "../utils/Uploads";
// import protect from "../middleware/AuthMiddleware";
const router = Router();

// HOTEL API
router.post("/insert-hotel-data", UploadFiles, insertHotelData);



// router.get('/hotel-data', getHotelData)
// router.get('/country-data', getCountryData)
// router.get('/city-data', getCityData)





export default router