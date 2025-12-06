import express, { Request, Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { initDB } from "./config/db";
import { authRoute } from "./modules/auth/auth.routes";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { bookingRoute } from "./modules/booking/booking.route";
const app = express();
app.use(express.json());

initDB();

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoute);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route",
    path: req.path,
  });
});

export default app;