// import { userPermissions } from './../middleware/Permissions';
import { Router } from "express";
import {  getHotelData, getCountryData, getCityData } from "../controllers/HotelBookingController";
// import protect from "../middleware/AuthMiddleware";
const router = Router();



router.get('/hotel-data', getHotelData)
router.get('/country-data', getCountryData)
router.get('/city-data', getCityData)





export default router