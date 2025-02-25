// src/models/CityModel.ts

import { DataTypes, Model } from "sequelize";
import Connection from "../db/dbConfig";

export interface CityModelProps {
    id?: number;
    country_code: string;
    country_name: string;
    city_code: string;
    city_name: string;
}

class CityModel extends Model<CityModelProps> {}

CityModel.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

        // Required Fields
        country_code: { type: DataTypes.STRING, allowNull: false },
        country_name: { type: DataTypes.STRING, allowNull: false },

        // Optional Fields
        city_code: { type: DataTypes.STRING },
        city_name: { type: DataTypes.STRING },
       
    },
    {
        timestamps: false,
        sequelize: Connection,
        tableName: "cities"
    }
);



export default CityModel;
