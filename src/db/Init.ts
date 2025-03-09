

// import AddHotelRom from '../model/AddHotelRom';

import AddHotelDataModel from "../model/AddHotelDataModel";
import AddRoomDataModel from "../model/AddRoomDataModel";
import HotelFacilitiesModel from "../model/HotelFacilitiesModel";
import HotelImagesModel from "../model/HotelImagesModel";
import RoomFacilitiesModel from "../model/RoomFacilitiesModel";
import RoomImagesModel from "../model/RoomImagesModel";

// import SupplierCategoryModel from "../model/SupplierCategoryModel";

const isDev = process.env.NODE_ENV === "development";

const dbInit = async () => {
  try {

    await AddHotelDataModel.sync({ force: false })
    await AddRoomDataModel.sync({force:false})
    await HotelImagesModel.sync({ force: false })
    await RoomImagesModel.sync({force:false})
    await HotelFacilitiesModel.sync({force:false})
    await RoomFacilitiesModel.sync({force:false})



    console.log('Database synchronization completed successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }

};

export default dbInit;
