// import { userPermissions } from './../middleware/Permissions';
import { Router } from "express";
import {   DeleteHotelImage, DeleteRoomImage, UpdateHotelStatus, getHotelData, getSingleHotelData, getUmrahHotelData, insertHotelData, updateHotelData } from "../controllers/HotelBookingController";
import { UploadFiles } from "../utils/Uploads";
// import protect from "../middleware/AuthMiddleware";
const router = Router();

// HOTEL API
router.post("/insert-hotel-data", UploadFiles, insertHotelData);
router.get("/get_hotel_data",getHotelData)
router.get('/get_single_hotel_data/:id',getSingleHotelData)
router.patch('/update_hotel_data/:id',UploadFiles,updateHotelData)
router.delete('/delete_hotel_image/:id',UploadFiles,DeleteHotelImage)
router.delete('/delete_room_image/:id',DeleteRoomImage)
router.patch('/update_hotel_status/:id',UpdateHotelStatus)

// get hotel data for umarah
router.get('/get-umrah-hotel',getUmrahHotelData)

// router.get('/hotel-data', getHotelData)
// router.get('/country-data', getCountryData)
// router.get('/city-data', getCityData)





export default router