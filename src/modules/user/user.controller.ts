import { Request, Response } from "express";
import { userServices } from "./user.service";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsersFromDB();
    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false, 
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    const authenticatedUserId = req.user?.id;
    const authenticatedUserRole = req.user?.role;

    if (authenticatedUserRole !== 'admin' && parseInt(userId as string) !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (authenticatedUserRole !== 'admin' && userData.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const updatedUser = await userServices.updateUserInDB(parseInt(userId as string), userData, authenticatedUserRole as string);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await userServices.deleteUserFromDB(parseInt(userId as string));
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
