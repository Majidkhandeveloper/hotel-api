import { DataTypes } from "sequelize";

// this file is build for all the enums inside the Models which might be used in commons thats why we have created separate file for these
// also we have created typescript enums file for this separatly inside common types folder

//used inside paxTable and PaxTableRefund models
export const incomeTypeEnum= DataTypes.ENUM("NET", "PSF", "income" , "Visa" , "Hotel" , "Insurance" , "Umrah" , "Transfer" , "Activity" , "Tour" , "Disc-Given","WHT","Self-Cancellation")
export const paxTitleEnum= DataTypes.ENUM("MR","MRS","MS","MISS","MSTR","INFT")
export const paxTypeEnum=DataTypes.ENUM("ADT","CNN","INF","SRC") 

// inside flight segmentModel
export const flownSegEnum=DataTypes.ENUM("used","void","refund","exchange","open")

export const JourneyEnum=DataTypes.ENUM("ONE WAY", "ROUND TRIP", "MULTI CITY")

// used in accVoucherTypeModel
export const voucherTypeEnum=DataTypes.ENUM( "IN", "JV", "PV", "RV", "CN", "CD", "DN")

// in flightTaxRefundModel & FlightTaxModel
export const taxUsesEnum=DataTypes.ENUM("USED", "REFUNDED", "PARTIAL-USED", "NOT-USED")
// In make_payment
export const MakePaymentEnum= DataTypes.ENUM("Pending","Rejected","Process")
// in bookingMainModel 
export const BookingTypesEnum= DataTypes.ENUM("flight","flight-group","insurance","visa","hotel","transfer","activity","umrah-visa","tour-invoice")
//in flightBookingModel
export const gdsProps= DataTypes.ENUM("hitit","1g","1s","pa","pf","er","9p","fz","wy")
// In flightBookingStausModel
export const bookStatusEnum= DataTypes.ENUM("Pending","Process","Requested","Rejected","Cancelled","Confirmed","Issued","Refunded","Voided")
// In Action type
export const actionTypeEnum= DataTypes.ENUM("Book","Cancel","Issued","Refund","Re Issue","Request By","Processed By")

export const ApiCredentialactionTypeEnum= DataTypes.ENUM('flight', 'hotel', 'insurance', 'visa', 'transfer', 'activity')

export const ApiCredentialactionGdsEnum= DataTypes.ENUM( 'hitit', 'airblue', 'sial', 'serene', 'one_api', 'sabre', 'amadeus', 'travelport', 'ek_nds', 'flydubai')
