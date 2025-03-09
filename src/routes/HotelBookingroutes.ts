// import { userPermissions } from './../middleware/Permissions';
import { Router } from "express";
import {   getHotelData, getSingleHotelData, insertHotelData, updateHotelData } from "../controllers/HotelBookingController";
import { UploadFiles } from "../utils/Uploads";
// import protect from "../middleware/AuthMiddleware";
const router = Router();

// HOTEL API
router.post("/insert-hotel-data", UploadFiles, insertHotelData);
router.get("/get_hotel_data",getHotelData)
router.get('/get_single_hotel_data/:id',getSingleHotelData)
router.patch('/update_hotel_data/:id',UploadFiles,updateHotelData)


// router.get('/hotel-data', getHotelData)
// router.get('/country-data', getCountryData)
// router.get('/city-data', getCityData)





export default router