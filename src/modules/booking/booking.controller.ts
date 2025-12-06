import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const create = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBookingIntoDB(req.body);
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;
    
    const result = await bookingServices.getAllBookingsFromDB(userRole as string, userId);
    
    const message = userRole === 'admin' 
      ? "Bookings retrieved successfully" 
      : "Your bookings retrieved successfully";
    
    return res.status(200).json({
      success: true,
      message,
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
    const { bookingId } = req.params;
    const userRole = req.user?.role;
    const userId = req.user?.id;
    
    const result = await bookingServices.updateBookingByIdInDB(
      parseInt(bookingId as string), 
      req.body, 
      userRole as string,
      userId as number
    );
    
    const message = req.body.status === 'cancelled' 
      ? "Booking cancelled successfully"
      : "Booking marked as returned. Vehicle is now available";
    
    return res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  create,
  getAll,
  updateById
};