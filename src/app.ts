import express from "express";
import cors from "cors";
import Connection from "./db/dbConfig";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// models
import dbInit from "./db/Init";
// routes

import HotelBookingRoutes from "./routes/HotelBookingroutes";
// import { ErrorMessage } from "./utils/ErrorMessage";


const app = express();

dotenv.config();
const PORT: number = parseInt(process.env.PORT || "4000");

// middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("", express.static("uploads"));
app.use("/site", express.static(__dirname + "uploads/site"));
app.use(
  cors({
    origin: {
      // this url and methods mean that this project is only access to this url and these methods only for security porpuse
      URL: [process.env.FRONTEND_URL],
    } as any,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
// tables generating
// make it comment when once table is created

// (async () => {
//   await dbInit();
// })();




app.use("/api/v1/b2b", HotelBookingRoutes);

app.use((req, res) => {
  console.log(res, "no routes found with : " + req.url, 404);
  
  // return ErrorMessage(res, "no routes found with : " + req.url, 404);
});

Connection.authenticate()
  .then((err) => {
    console.log("Connected successfully to the database.");
  })
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
  });
Connection.sync()
  .then(() => {
    console.log("tables created");
  })
  .catch((error: any) => {
    console.error("An error occured while creating table", error);
  });

app.listen(PORT, () => {
  console.log(`server runs on PORT ${PORT}`);
});
