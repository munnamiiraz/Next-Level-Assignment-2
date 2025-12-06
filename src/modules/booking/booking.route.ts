import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth("admin", "customer"), bookingController.getAll);
router.post("/", auth("customer", "admin"), bookingController.create);
router.put("/:bookingId", auth("admin", "customer"), bookingController.updateById);

export const bookingRoute = router;