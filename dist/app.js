"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./db/dbConfig"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// models
const Init_1 = __importDefault(require("./db/Init"));
// routes
const HotelBookingroutes_1 = __importDefault(require("./routes/HotelBookingroutes"));
// import { ErrorMessage } from "./utils/ErrorMessage";
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT || "4000");
// middlewares
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use("", express_1.default.static("uploads"));
app.use("/site", express_1.default.static(__dirname + "uploads/site"));
app.use((0, cors_1.default)({
    origin: {
        // this url and methods mean that this project is only access to this url and these methods only for security porpuse
        URL: [process.env.FRONTEND_URL],
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
// tables generating
// make it comment when once table is created
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Init_1.default)();
}))();
app.use("/api/v1/b2b", HotelBookingroutes_1.default);
app.use((req, res) => {
    console.log(res, "no routes found with : " + req.url, 404);
    // return ErrorMessage(res, "no routes found with : " + req.url, 404);
});
dbConfig_1.default.authenticate()
    .then((err) => {
    console.log("Connected successfully to the database.");
})
    .catch((error) => {
    console.log("Unable to connect to the database:", error);
});
dbConfig_1.default.sync()
    .then(() => {
    console.log("tables created");
})
    .catch((error) => {
    console.error("An error occured while creating table", error);
});
app.listen(PORT, () => {
    console.log(`server runs on PORT ${PORT}`);
});
