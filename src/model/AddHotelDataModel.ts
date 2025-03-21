// src/models/AddHotelData.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";

export interface AddHotelDataModelProps {
    id?: number;
    hotel_name: string;
    hotel_star: number;
    hotel_address: string;
    hotel_country: string;
    hotel_contact: string;
    hotel_umrah_status: boolean;
    hotel_status:boolean;
    hotel_city: string;
    supplier_name:string;
    supplier_acc_id:string;
    cur_label:string;
    currency:number;
    roe:number;
}

class AddHotelDataModel extends Model<AddHotelDataModelProps> {}

AddHotelDataModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        hotel_name: { type: DataTypes.STRING, allowNull: false },
        hotel_star: { type: DataTypes.INTEGER, allowNull: false },
        hotel_address: { type: DataTypes.STRING },
        hotel_country: { type: DataTypes.STRING },
        hotel_contact: { type: DataTypes.STRING },
        hotel_umrah_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        hotel_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        hotel_city: { type: DataTypes.STRING },
        cur_label:{type:DataTypes.STRING},
        supplier_name:{type:DataTypes.STRING},
        supplier_acc_id:{type:DataTypes.STRING},
        currency:{type:DataTypes.INTEGER},
        roe:{type:DataTypes.INTEGER},


    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "addhoteldata"
    }
);



export default AddHotelDataModel;
