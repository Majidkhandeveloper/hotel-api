"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCredentialactionGdsEnum = exports.ApiCredentialactionTypeEnum = exports.actionTypeEnum = exports.bookStatusEnum = exports.gdsProps = exports.BookingTypesEnum = exports.MakePaymentEnum = exports.taxUsesEnum = exports.voucherTypeEnum = exports.JourneyEnum = exports.flownSegEnum = exports.paxTypeEnum = exports.paxTitleEnum = exports.incomeTypeEnum = void 0;
const sequelize_1 = require("sequelize");
// this file is build for all the enums inside the Models which might be used in commons thats why we have created separate file for these
// also we have created typescript enums file for this separatly inside common types folder
//used inside paxTable and PaxTableRefund models
exports.incomeTypeEnum = sequelize_1.DataTypes.ENUM("NET", "PSF", "income", "Visa", "Hotel", "Insurance", "Umrah", "Transfer", "Activity", "Tour", "Disc-Given", "WHT", "Self-Cancellation");
exports.paxTitleEnum = sequelize_1.DataTypes.ENUM("MR", "MRS", "MS", "MISS", "MSTR", "INFT");
exports.paxTypeEnum = sequelize_1.DataTypes.ENUM("ADT", "CNN", "INF", "SRC");
// inside flight segmentModel
exports.flownSegEnum = sequelize_1.DataTypes.ENUM("used", "void", "refund", "exchange", "open");
exports.JourneyEnum = sequelize_1.DataTypes.ENUM("ONE WAY", "ROUND TRIP", "MULTI CITY");
// used in accVoucherTypeModel
exports.voucherTypeEnum = sequelize_1.DataTypes.ENUM("IN", "JV", "PV", "RV", "CN", "CD", "DN");
// in flightTaxRefundModel & FlightTaxModel
exports.taxUsesEnum = sequelize_1.DataTypes.ENUM("USED", "REFUNDED", "PARTIAL-USED", "NOT-USED");
// In make_payment
exports.MakePaymentEnum = sequelize_1.DataTypes.ENUM("Pending", "Rejected", "Process");
// in bookingMainModel 
exports.BookingTypesEnum = sequelize_1.DataTypes.ENUM("flight", "flight-group", "insurance", "visa", "hotel", "transfer", "activity", "umrah-visa", "tour-invoice");
//in flightBookingModel
exports.gdsProps = sequelize_1.DataTypes.ENUM("hitit", "1g", "1s", "pa", "pf", "er", "9p", "fz", "wy");
// In flightBookingStausModel
exports.bookStatusEnum = sequelize_1.DataTypes.ENUM("Pending", "Process", "Requested", "Rejected", "Cancelled", "Confirmed", "Issued", "Refunded", "Voided");
// In Action type
exports.actionTypeEnum = sequelize_1.DataTypes.ENUM("Book", "Cancel", "Issued", "Refund", "Re Issue", "Request By", "Processed By");
exports.ApiCredentialactionTypeEnum = sequelize_1.DataTypes.ENUM('flight', 'hotel', 'insurance', 'visa', 'transfer', 'activity');
exports.ApiCredentialactionGdsEnum = sequelize_1.DataTypes.ENUM('hitit', 'airblue', 'sial', 'serene', 'one_api', 'sabre', 'amadeus', 'travelport', 'ek_nds', 'flydubai');
