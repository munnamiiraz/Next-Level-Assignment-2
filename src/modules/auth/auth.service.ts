import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";

export const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

const signupUserIntoDB = async (user: any) => {
  const { name, email, password, phone, role } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `,
    [name, email, hashedPassword, phone, role]
  );
  const userData = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    phone : result.rows[0].phone,
    role : result.rows[0].role,
  };
  return userData;
};

const signinUserIntoDB = async (email: string, password: string) => {
  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  if (user.rows.length === 0) {
    throw new Error("User not found!");
  }
  const matchPassowrd = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassowrd) {
    throw new Error("Invalid Credentials!");
  }
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    phone : user.rows[0].phone,
    role : user.rows[0].role,
  };

  const token = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });

  return {token, user: jwtPayload};
};

export const authServices = {
  signinUserIntoDB,
  signupUserIntoDB
};