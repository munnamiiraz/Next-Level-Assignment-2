import { pool } from "../../config/db";

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result.rows;
};

const updateUserInDB = async (userId: number, userData: any, userRole: string) => {
  const currentUserResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (currentUserResult.rows.length === 0) {
    return null;
  }

  let updatedData = currentUserResult.rows[0];

  if("name" in userData) updatedData.name = userData.name;
  if("email" in userData) updatedData.email = userData.email;
  if("phone" in userData) updatedData.phone = userData.phone;
  if("role" in userData && userRole === 'admin') updatedData.role = userData.role;

  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, phone = $3, role = $4
    WHERE id = $5 RETURNING id, name, email, phone, role`,
    [updatedData.name, updatedData.email, updatedData.phone, updatedData.role, userId]
  );
  return result.rows[0];
};

const deleteUserFromDB = async (userId: number) => {
  const activeBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`, [userId]);
  if (activeBookings.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }
  
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
  if (result.rowCount === 0) {
    throw new Error('User not found');
  }
  return;
};

export const userServices = {
  getAllUsersFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
