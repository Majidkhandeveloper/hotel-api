

// import AddHotelRom from '../model/AddHotelRom';

import AddHotelDataModel from "../model/AddHotelDataModel";
import AddRoomDataModel from "../model/AddRoomDataModel";
import HotelFacilitiesModel from "../model/HotelFacilitiesModel";
import HotelImagesModel from "../model/HotelImagesModel";
import RoomAvailability from "../model/RoomAvailability";
import RoomFacilitiesModel from "../model/RoomFacilitiesModel";
import RoomImagesModel from "../model/RoomImagesModel";

// import SupplierCategoryModel from "../model/SupplierCategoryModel";

const isDev = process.env.NODE_ENV === "development";

const dbInit = async () => {
  try {

    await AddHotelDataModel.sync({ alter: true });
    await AddRoomDataModel.sync({ alter: true });
    await HotelImagesModel.sync({ alter: true });
    await RoomImagesModel.sync({ alter: true });
    await HotelFacilitiesModel.sync({ alter: true });
    await RoomFacilitiesModel.sync({ alter: true });
    await RoomAvailability.sync({ alter: true });




    console.log('Database synchronization completed successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }

};

export default dbInit;
