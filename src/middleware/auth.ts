import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../modules/auth/auth.service";
import { pool } from "../config/db";


const auth = (...allowedRoles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token as string, secret) as JwtPayload;
      const result = await pool.query(
        `SELECT id, email, role FROM users WHERE email=$1`,
        [decoded.email]
      );
      
      
      
      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      
      const dbUser = result.rows[0];
      

      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role
      };

      if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
};

export default auth;
