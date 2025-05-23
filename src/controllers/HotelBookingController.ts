import { Request, Response } from "express";
import { date, z } from "zod";
import Sequelize, { FindOptions, Model, Op, where } from "sequelize";
import AddHotelDataModel from "../model/AddHotelDataModel";
import AddRoomDataModel from "../model/AddRoomDataModel";
import Connection from "../db/dbConfig";
import HotelImagesModel from "../model/HotelImagesModel";
import RoomImagesModel from "../model/RoomImagesModel";
import HotelFacilitiesModel from "../model/HotelFacilitiesModel";
import RoomFacilitiesModel from "../model/RoomFacilitiesModel";
import RoomAvailability from "../model/RoomAvailability";
import moment from "moment";


// HOTEL API 


export const insertHotelData = async (req: Request, res: Response) => {
  const transaction = await Connection.transaction(); // Start transaction

  try {
    const { hotelRooms, hotel_facilities, ...hotelDetails } = req.body;
    const files = req.files as Express.Multer.File[];

    // Extract hotel images
    const hotelImages: string[] = files
      ?.filter((file) => file.fieldname === "hotel_images")
      ?.map((file) => file.filename) || [];

    // Extract room images dynamically
    const RoomsImages: { roomIndex: number; roomImages: string[] }[] = [];
    if (hotelRooms && Array.isArray(hotelRooms)) {
      hotelRooms.forEach((_: any, i: number) => {
        const roomImages = files
          ?.filter((file) => file.fieldname === `room_images_${i}`)
          ?.map((file) => file.filename) || [];
        RoomsImages.push({ roomIndex: i, roomImages });
      });
    }

    // Insert hotel data with transaction
    const hotelData = await AddHotelDataModel.create({
      ...hotelDetails,
      cur_label: hotelRooms.at(0).cur_label,
      currency: hotelRooms.at(0).currency,
      roe: hotelRooms.at(0).roe,
    }, { transaction });
    const hotelId = hotelData.dataValues.id as any; // Get the inserted hotel ID
    // Insert hoteliImages
    if (hotelImages.length > 0) {
      await HotelImagesModel.bulkCreate(
        hotelImages.map((imagePath) => ({
          hotel_id: hotelId,
          hotel_images: imagePath,
        })),
        { transaction }
      );
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
        await HotelFacilitiesModel.bulkCreate(facilitiesEntries, { transaction });
      } else {
        console.log("No valid facilities to insert.");
      }
    }


    const roomBody = hotelRooms.map((rm: any) => ({
      ...rm,
      hotel_id: hotelId,
      room_rate_start_date: new Date(rm.room_rate_start_date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
      room_rate_end_date: new Date(rm.room_rate_end_date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
    }));

    // Insert room data
    const roomData = await AddRoomDataModel.bulkCreate(roomBody, { transaction });
    const roomDataArray = {
      roomData: roomData,
      hotelId: hotelData.dataValues.id,
      hotelName: hotelData.dataValues.hotel_name,
    }

    generateAvailabilityForRooms(roomDataArray)

    // Insert room images
    const roomImageEntries = roomData.flatMap((room: any, index: any) => {
      const roomImages = RoomsImages.find((ri) => ri.roomIndex === index)
        ?.roomImages || [];
      return roomImages.map((imagePath) => ({
        room_id: room.id, // Get room ID from createdRooms
        room_images: imagePath,
      }));
    });

    if (roomImageEntries.length > 0) {
      await RoomImagesModel.bulkCreate(roomImageEntries, { transaction });
    }

    const roomFacilitiesEntries = roomData.flatMap((room: any, index) => {
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
      await RoomFacilitiesModel.bulkCreate(roomFacilitiesEntries, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      message: "Hotel and rooms added successfully",
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

const generateAvailabilityForRooms = async (roomDataArray: { roomData: any; hotelId: any; hotelName?: any; }) => {
  const allRecords = [] as any;

  for (const data of roomDataArray.roomData) {
    const typeObj = {
      Standard: "STD",
      Deluxe: "DLX",
      Suite: "SUI",
      Executive: "EXE",
      Superior: "Sup"
    } as any
    const occupancyObj = {
      Single: "SIN",
      Double: "DBL",
      Triple: "TRI",
      Quad: "QUA",
      Twin: "TWN"
    }

    const startDate = moment(data.room_rate_start_date, 'YYYY-MM-DD');
    const endDate = moment(data.room_rate_end_date, 'YYYY-MM-DD');
    const quantity = parseInt(data.room_quantity);
    const roomTypeShort = typeObj[data.room_type];
    const occShort = occupancyObj[data.room_occupancy as keyof typeof occupancyObj];
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
          is_aviabille: "true",
          book_start_end_date: "",
          agent_acc_id: 0,
          pax_name: "",
          roe: "",
          curr: "",
          rates: "",
          plus_up: "",
        });

        current.add(1, 'day');
      }
    }
  }

  await RoomAvailability.bulkCreate(allRecords);
  console.log(`✅ Inserted ${allRecords.length} room availability records`);
};




export const getHotelData = async (req: Request, res: Response) => {
  try {

    const data = await AddHotelDataModel.findAll({
      include: [
        {
          model: HotelImagesModel,
          as: "hotel_images",
          attributes: ['hotel_images']
        }],
      order: [["id", "DESC"]],
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Hotels retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSingleHotelData = async (req: Request, res: Response) => {
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
    const data = await AddHotelDataModel.findOne({
      include: [
        {
          model: HotelFacilitiesModel,
          as: "hotel_facilities",
          attributes: ['facility']
        },
        {
          model: HotelImagesModel,
          as: "hotel_images",
          attributes: ["id", "hotel_images"]

        },
        {
          model: AddRoomDataModel,
          as: "hotel_rooms",
          include: [
            {
              model: RoomFacilitiesModel,
              as: "room_facilities"
            },
            {
              model: RoomImagesModel,
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

  } catch (error) {
    console.error("Error fetching single hotel data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


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

export const getUmrahHotelData = async (req: Request, res: Response) => {
  try {
    const { check_in_date, check_out_date } = req.query; // Get from request query params

    if (!check_in_date || !check_out_date) {
      return res.status(400).json({
        success: false,
        message: "Check-in and Check-out dates are required.",
      });
    }
    function getDateRange(startDate: any, endDate: any) {
      const dates = [];
      let current = moment(startDate);
      const end = moment(endDate);

      while (current.isBefore(end)) { // Excludes checkout date
        dates.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
      }

      return dates;
    }
    const dates = getDateRange(check_in_date, check_out_date); // Excludes checkout
    function extractDateFromHname(hname: string) {
      const parts = hname.split("-");
      const dd = parts[parts.length - 3];
      const mm = parts[parts.length - 2];
      const yy = parts[parts.length - 1];
      return `20${yy}-${mm}-${dd}`; // "2025-06-01"
    }
    // Fetch the hotels where check-in and check-out dates are within the specified range
    const data = await AddHotelDataModel.findAll({
      include: [
        {
          model: HotelFacilitiesModel,
          as: "hotel_facilities",
          attributes: ["facility"],
        },
        {
          model: HotelImagesModel,
          as: "hotel_images",
          attributes: ["id", "hotel_images"],
        },
        {
          model: AddRoomDataModel,
          as: "hotel_rooms",
          include: [
            {
              model: RoomFacilitiesModel,
              as: "room_facilities",
            },
            {
              model: RoomImagesModel,
              as: "room_images",
            },
            {
              model: RoomAvailability

            }
          ],
          where: {

            // room_rate_start_date: {
            //   [Op.lte]: check_out_date, // Room check-in date should be before or on check-out date
            // },
            // room_rate_end_date: {
            //   [Op.gte]: check_in_date, // Room check-out date should be after or on check-in date
            // },
            where: Sequelize.literal(`
              STR_TO_DATE(room_rate_start_date, '%Y-%m-%d') <= '${dates[0]}' AND
              STR_TO_DATE(room_rate_end_date, '%Y-%m-%d') >= '${dates[dates.length - 1]}'
            `),
          },
        },
      ],
      where: { hotel_umrah_status: 1 },
    }) as any;

    console.log("dates", dates);

    // const result = filterHotelsByAvailability(data, dates);
    data
      .map((hotel: any) => {
        const filteredRooms = hotel.hotel_rooms.filter((room: any) => {
          const availabilities = room.RoomAvailabilities || [];

          // ✅ Build a map of dates to available series
          const availabilityMap: Record<string, number> = {};

          availabilities.forEach((avail: any) => {
            if (avail.is_aviabille === "true" && (!avail.book_start_end_date || avail.book_start_end_date.trim() === "")) {
              const dateStr = extractDateFromHname(avail.hname_typ_occ_rmid);
              console.log("dateStr",dateStr);
              console.log("date",dates);
              
              availabilityMap[dateStr] = (availabilityMap[dateStr] || 0) + 1;
            }
          });

          // ✅ Room must have at least 1 available unit for **every date**
          const isFullyAvailable = dates.every(date => availabilityMap[date] && availabilityMap[date] > 0);

          return isFullyAvailable;
        });

        return {
          ...hotel,
          hotel_rooms: filteredRooms,
        };
      })
      .filter((hotel: any) => hotel.hotel_rooms.length > 0);

  

    const filteredHotels = data


    console.log("filteredHotels", filteredHotels);


    if (!filteredHotels.length) {
      return res.status(404).json({
        success: false,
        message: "No hotels found for the given date range",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotels retrieved successfully",
      filteredHotels,
    });

  } catch (error) {
    console.error("Error fetching Umrah hotel data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

function filterHotelsByAvailability(hotels: any[], requiredDates: string[]) {
  return hotels
    .map((hotel: any) => {
      const filteredRooms = hotel.hotel_rooms.filter((room: any) => {
        const availabilities = room.RoomAvailabilities || [];

        // Filter available records
        const availableDates = availabilities
          .filter((avail: any) =>
            avail.is_aviabille === "true" &&
            (!avail.book_start_end_date || avail.book_start_end_date.trim() === "")
          )
          .map((avail: any) => {
            const parts = avail.hname_typ_occ_rmid.split("-");
            const dd = parts[parts.length - 3];
            const mm = parts[parts.length - 2];
            const yy = parts[parts.length - 1];
            return `20${yy}-${mm}-${dd}`; // format: YYYY-MM-DD
          });

        // Keep room only if all requiredDates are in the list
        return requiredDates.every(date => availableDates.includes(date));
      });

      return {
        ...hotel,
        hotel_rooms: filteredRooms,
      };
    })
    .filter(hotel => hotel.hotel_rooms.length > 0);
}


export const updateHotelData = async (req: Request, res: Response) => {
  const transaction = await Connection.transaction();

  try {
    const { id } = req.params;
    const { hotelRooms, hotel_facilities, ...hotelDetails } = req.body;
    const files = req.files as Express.Multer.File[];

    const hotelId = parseInt(id);

    if (isNaN(hotelId)) {
      return res.status(400).json({ success: false, message: "Invalid hotel ID" });
    }

    // Check if hotel exists
    const existingHotel = await AddHotelDataModel.findOne({
      where: { id: hotelId },  // Correct placement of where condition
      include: [
        {
          model: HotelFacilitiesModel,
          as: "hotel_facilities",
          attributes: ["facility"],
        },
        {
          model: HotelImagesModel,
          as: "hotel_images",
          attributes: ["id", "hotel_images"],
        },
        {
          model: AddRoomDataModel,
          as: "hotel_rooms",
          include: [
            {
              model: RoomFacilitiesModel,
              as: "room_facilities",
            },
            {
              model: RoomImagesModel,
              as: "room_images",
              attributes: ["id", "room_images"], // Uncommented attributes
            },
          ],
        },
      ],
    }) as any;

    if (!existingHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    // Update hotel details
    await AddHotelDataModel.update(hotelDetails, { where: { id: hotelId }, transaction });

    // Extract hotel images
    const hotelImages: string[] = files
      ?.filter((file) => file.fieldname === "hotel_images")
      ?.map((file) => file.filename) || [];

    const existingImages = await HotelImagesModel.findAll({
      where: { hotel_id: hotelId },
      attributes: ["hotel_images"],
    }) as any;

    const existingImagePaths = existingImages.map((img: { hotel_images: string }) => img.hotel_images);

    // Merge old and new images
    const updatedImages = [...existingImagePaths, ...hotelImages];

    // Insert only **new images** (prevent duplicates)
    const newImagesToInsert = hotelImages.filter(img => !existingImagePaths.includes(img));
    // Remove old images and insert new ones
    if (hotelImages.length > 0) {
      await HotelImagesModel.destroy({ where: { hotel_id: hotelId }, transaction });
      await HotelImagesModel.bulkCreate(
        updatedImages.map((imagePath) => ({
          hotel_id: hotelId,
          hotel_images: imagePath,
        })),
        { transaction }
      );
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

      await HotelFacilitiesModel.destroy({ where: { hotel_id: hotelId }, transaction });
      if (facilitiesEntries.length > 0) {
        await HotelFacilitiesModel.bulkCreate(facilitiesEntries, { transaction });
      }
    }

    // Handle Room Updates
    if (hotelRooms && Array.isArray(hotelRooms)) {
      await AddRoomDataModel.destroy({ where: { hotel_id: hotelId }, transaction });

      const roomData = await AddRoomDataModel.bulkCreate(
        hotelRooms.map((rm: any) => ({
          ...rm,
          hotel_id: hotelId,
          // room_rate_start_date: new Date(),
          // room_rate_end_date: new Date(),
        })),
        { transaction, returning: true }
      );
      const roomDataArray = {
        roomData: roomData,
        hotelId: existingHotel.dataValues.id,
        hotelName: existingHotel.dataValues.hotel_name,
      }

      generateAvailabilityForRooms(roomDataArray);
      /////////////////////////////////////////////////////////////////////////////////////room images//////////////////////////////////
      const existingRoomImages = await RoomImagesModel.findAll({
        where: { room_id: existingHotel.hotel_rooms.map((room: any) => room.id) },
        attributes: ["room_id", "room_images"],
      }) as any;

      const existingImagesMap: Record<number, string[]> = {};

      // Assign images to their original index
      existingHotel.hotel_rooms.forEach((room: any, index: number) => {
        existingImagesMap[index] = existingRoomImages
          .filter((img: any) => img.room_id === room.id)
          .map((img: any) => img.room_images);
      });


      // Step 2: Extract new images uploaded for each room
      const RoomsImages: { roomIndex: number; roomImages: string[] }[] = [];

      hotelRooms.forEach((_, i: number) => {
        const roomImages = files
          ?.filter((file) => file.fieldname === `room_images_${i}`)
          ?.map((file) => file.filename) || [];
        RoomsImages.push({ roomIndex: i, roomImages });
      })

      // Step 3: Merge existing & new images for each room (Avoid Duplicates)
      const roomImageEntries = roomData.flatMap((room: any, index: number) => {

        // Get old images based on the index
        const oldImages = existingImagesMap[index] || [];

        // Get new images uploaded for this room
        const newImages = RoomsImages.find((ri) => ri.roomIndex === index)?.roomImages || [];

        // Only add new images that are not already in the DB
        const uniqueNewImages = newImages.filter((img) => !oldImages.includes(img));

        return [...oldImages, ...uniqueNewImages].map((imagePath) => ({
          room_id: room.id, // Assign the new room ID here
          room_images: imagePath,
        }));
      });

      // Step 4: Remove Old Images and Insert Updated Ones
      await RoomImagesModel.destroy({
        where: { room_id: existingHotel.hotel_rooms.map((room: any) => room.id) },
        transaction,
      });

      if (roomImageEntries.length > 0) {
        await RoomImagesModel.bulkCreate(roomImageEntries, { transaction });
      }


      // Update Room Facilities
      const roomFacilitiesEntries = roomData.flatMap((room: any, index) => {
        const originalRoom = hotelRooms[index];
        if (originalRoom?.room_facilities && typeof originalRoom.room_facilities === "object") {
          return Object.entries(originalRoom.room_facilities)
            .filter(([_, value]) => value === true || value === "true")
            .map(([facility]) => ({
              room_id: room.id,
              facility: facility,
            }));
        }
        return [];
      });

      await RoomFacilitiesModel.destroy({ where: { room_id: roomData.map((room: any) => room.id) }, transaction });
      if (roomFacilitiesEntries.length > 0) {
        await RoomFacilitiesModel.bulkCreate(roomFacilitiesEntries, { transaction });
      }
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Error updating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const DeleteHotelImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteResult = await HotelImagesModel.destroy({
      where: { id: id },
    });

    if (deleteResult === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const UpdateHotelStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { hotel_status } = req.body;
    const updateResult = await AddHotelDataModel.update(
      { hotel_status },
      { where: { id } }
    );

    if (updateResult[0] === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel status updated successfully", hotel_status });
  } catch (error) {
    console.error("Error updating hotel status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const DeleteRoomImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteResult = await RoomImagesModel.destroy({
      where: { id: id },
    });

    if (deleteResult === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// update room availability data

export const updateRoomAvailabilityData = async (req: Request, res: Response) => {
  try {
    const { hotels } = req.body;
    const transformed: any = hotels.flatMap((hotel: {
      agent_acc_id: any;
      toDate: any;
      fromDate: any; secondColumn: any[]; id: any;
    }) =>
      hotel.secondColumn?.map(room => ({
        ...room,
        agent_acc_id: hotel.agent_acc_id,
        start_date: new Date(hotel.fromDate),
        end_date: new Date(hotel.toDate),
      }))
    );

    function getDateRange(start: moment.MomentInput, end: moment.MomentInput) {
      const dates = [];
      let current = moment(start);
      const last = moment(end);
      // isSameOrBefore   prevous use include checout date isBefore methos exlude checkout date
      while (current.isBefore(last, 'day')) {
        dates.push(current.format('YYYY-MM-DD'));
        current.add(1, 'day');
      }

      return dates;
    }



    for (const room of transformed) {
      const dates = getDateRange(room.start_date, room.end_date);

      const typeObj = {
        Standard: "STD",
        Deluxe: "DLX",
        Suite: "SUI",
        Executive: "EXE",
        Superior: "Sup"
      } as any;

      const occupancyObj = {
        Single: "SIN",
        Double: "DBL",
        Triple: "TRI",
        Quad: "QUA",
        Twin: "TWN"
      } as any;

      for (const date of dates) {
        const formattedDate = moment(date).format("DD-MM-YY");

        // Step 1: Fetch matching rows (without filtering by book_start_end_date)
        const matchingRecords = await RoomAvailability.findAll({
          where: {
            room_id: room.roomId,
            hname_typ_occ_rmid: {
              [Op.like]: `%${typeObj[room.roomType]}—${occupancyObj[room.roomOccupancy]}%${formattedDate}`
            }
          },
          order: [['id', 'ASC']]
        }) as any;

        const recordsToUpdate = matchingRecords
          .filter((record: any) => {
            return record.is_aviabille === 'true';
          })
          .slice(0, room.selectedRoom);

        // Step 3: Update
        for (const record of recordsToUpdate) {
          await record.update({
            agent_acc_id: 0,
            is_aviabille: "false",
            book_start_end_date: formattedDate,
          });
        }
      }
    }


    res.status(200).json({ message: "Room availability updated successfully" });
  } catch (error) {
    console.error("Error updating room availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
