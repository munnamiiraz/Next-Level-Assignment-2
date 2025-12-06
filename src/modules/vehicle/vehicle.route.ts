import {  Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router()

router.get('/', vehicleController.getAll)
router.post('/', auth('admin'), vehicleController.create)
router.get('/:vehicleId', vehicleController.getById)
router.put('/:vehicleId', auth('admin'), vehicleController.updateById)
router.delete('/:vehicleId', auth('admin'), vehicleController.deleteById)

export const vehicleRoute = router