import { Request, Response } from "express";
import { date, z } from "zod";
import Sequelize, { FindOptions, Model, Op, where } from "sequelize";
import AddHotelDataModel from "../model/AddHotelDataModel";
import AddRoomDataModel from "../model/AddRoomDataModel";
import Connection from "../db/dbConfig";


// HOTEL API 


export const insertHotelData = async (req: Request, res: Response) => {
  const transaction = await Connection.transaction(); // Start transaction

  try {
    const { hotelRooms, hotel_facilities, hotel_umrah_status, ...hotelDetails } = req.body;
    const files = req.files as Express.Multer.File[];

    // Extract hotel images
    const hotelImages = files
      ?.filter((file) => file.fieldname === "hotel_images")
      ?.map((file) => file.path) || [];

    // Extract room images dynamically
    const RoomsImages: { roomIndex: number; roomImages: string[] }[] = [];
    if (hotelRooms && Array.isArray(hotelRooms)) {
      hotelRooms.forEach((_: any, i: number) => {
        const roomImages = files
          ?.filter((file) => file.fieldname === `room_images_${i}`)
          ?.map((file) => file.path) || [];
        RoomsImages.push({ roomIndex: i, roomImages });
      });
    }

    // Insert hotel data with transaction
    const hotelData = await AddHotelDataModel.create(hotelDetails, { transaction });

    const hotelId = hotelData.dataValues.id; // Get the inserted hotel ID

    const roomBody = hotelRooms.map((rm: any) => ({
      ...rm,
      hotel_id: hotelId,
      room_rate_start_date: new Date(rm.room_rate_start_date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
      room_rate_end_date: new Date(rm.room_rate_end_date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
    }));

    // Insert room data
    await AddRoomDataModel.bulkCreate(roomBody, { transaction });

    await transaction.commit(); 

    res.status(201).json({
      message: "Hotel and rooms added successfully",
    });

  } catch (error) {
    await transaction.rollback(); 
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};





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
