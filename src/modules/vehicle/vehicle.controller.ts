import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";


const getAll = async(req : Request, res : Response)=>{
  try {
    const result = await vehicleServices.getAllVehiclesFromDB()
    if(result.length === 0){
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }
      return res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

const getById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleServices.getVehicleByIdFromDB(parseInt(vehicleId as string));

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleServices.updateVehicleByIdInDB(parseInt(vehicleId as string), req.body);

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    await vehicleServices.deleteVehicleByIdFromDB(parseInt(vehicleId as string));
    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const create = async(req : Request,res : Response)=>{
  try {
    const result = await vehicleServices.createVehicleIntoDB(req.body)
      return res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}


export const vehicleController = {
  getAll,
  create,
  getById,
  updateById,
  deleteById
}