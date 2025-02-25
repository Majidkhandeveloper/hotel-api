
import AddHotelModel from '../model/AddHotelModel';
import AddRoomData from '../model/AddRoomData';
// import AddHotelRom from '../model/AddHotelRom';

// import SupplierCategoryModel from "../model/SupplierCategoryModel";

const isDev = process.env.NODE_ENV === "development";

const dbInit = async () => {
  try {

    await AddHotelModel.sync({ force: false })
    await AddRoomData.sync({force:false})
    console.log('Database synchronization completed successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }

};

export default dbInit;
