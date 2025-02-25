import { Request, Response } from "express";
import { date, z } from "zod";
import Sequelize, { FindOptions, Model, Op, where } from "sequelize";
import HotelDataModel from "../model/HotelDataModel";
import CityModel from "../model/CityModel";


const segmentSchema = z.object({
    main_id:z.number(),
    htl_name:z.string(),
    ckin_date:z.date().optional(),
    ckout_date:z.date().optional(),
    room_name:z.string(),
    confirmation_no:z.number(),
    remarks:z.string(),

})



// hotel data
export const getHotelData = async (req:Request,res:Response) => {
    try {
      const name = req.query.name;
      const data = await HotelDataModel.findAll({
        where: {
          name: 
          {
            [Op.like]: `%${name}%`,
          },
        },
      });
      console.log("data",data);
      
      // return ResponseMessage(res,200,data);
    } catch (error) {
        // return ResponseMessage(res,200,undefined,"Data Get successfully");
    }
  };

  export const getCountryData = async (req: Request, res: Response) => {
    try {
      const name = req.query.name;
      const data = await CityModel.findAll({
        where: {
          country_name: {
            [Op.like]: `%${name}%`,
          },
        },
        attributes: ['country_name','country_code'], // Only get the country_name column
        group: ['country_name'], // Group by country_name to get unique records
        // distinct: true, // Ensure unique values
      }) as any;
  
      // return ResponseMessage(res, 200, data);
    } catch (error) {
      // return ResponseMessage(res, 500, undefined, "Error getting data");
    }
  };



  export const getCityData = async (req: Request, res: Response) => {
    try {
      const { name, code } = req.query;
  
      const whereCondition = {
        ...(name && { city_name: { [Op.like]: `%${name}%` } }),
        ...(code && { country_code: code }), // Exact match for code
      } as any;
  
      const data = await CityModel.findAll({
        where: whereCondition,
        attributes: ['city_name', 'country_code'], // Specify needed attributes
        group: ['city_name'], // Group by both to ensure uniqueness
        // distinct: true,
      }) as any;
  
      // return ResponseMessage(res, 200, data);
    } catch (error) {
      // return ResponseMessage(res, 500, undefined, "Error getting data");
    }
  };
