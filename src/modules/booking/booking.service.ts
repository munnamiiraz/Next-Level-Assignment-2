import { pool } from "../../config/db";

const createBookingIntoDB = async (booking: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = booking;
  
  
  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`,
    [vehicle_id]
  );
  
  if (vehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found or not available');
  }
  
  const vehicle = vehicleResult.rows[0];
  
  
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const total_price = days * parseFloat(vehicle.daily_rent_price);
  

  const bookingResult = await pool.query(`
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
    VALUES ($1, $2, $3, $4, $5, 'active') 
    RETURNING *
  `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);
  
  await pool.query(
    `UPDATE vehicles SET availability_status = 'unavailable' WHERE id = $1`,
    [vehicle_id]
  );
  
  const booking_data = bookingResult.rows[0];
  return {
    ...booking_data,
    rent_start_date: rent_start_date,
    rent_end_date: rent_end_date,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price
    }
  };
};

const getAllBookingsFromDB = async (userRole: string, userId?: number) => {
  if (userRole === 'admin') {
    const result = await pool.query(`
      SELECT 
        b.*,
        u.name as customer_name,
        u.email as customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `);
    
    
    return result.rows.map(row => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date.toISOString().split('T')[0],
      rent_end_date: row.rent_end_date.toISOString().split('T')[0],
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number
      }
    }));
  } else {
    const result = await pool.query(`
      SELECT 
        b.*,
        v.vehicle_name,
        v.registration_number,
        v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date.toISOString().split('T')[0],
      rent_end_date: row.rent_end_date.toISOString().split('T')[0],
      total_price: row.total_price,
      status: row.status,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type
      }
    }));
  }
};

const updateBookingByIdInDB = async (bookingId: number, updateData: any, userRole: string, userId: number) => {
  const { status } = updateData;

  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );
  
  if (bookingResult.rows.length === 0) {
    throw new Error('Booking not found');
  }
  
  const booking = bookingResult.rows[0];
  
  if (userRole === 'customer' && booking.customer_id !== userId) {
    throw new Error('You can only update your own bookings');
  }
  
  if (userRole === 'customer' && status !== 'cancelled') {
    throw new Error('Customers can only cancel bookings');
  }
  
  if (status === 'cancelled' && booking.status !== 'active') {
    throw new Error('Only active bookings can be cancelled');
  }
  
  if (status === 'returned' && booking.status !== 'active') {
    throw new Error('Only active bookings can be marked as returned');
  }
  

  const updatedBooking = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );
  
  if (status === 'cancelled' || status === 'returned') {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
  }
  
  const result = updatedBooking.rows[0];
  const formattedResult = {
    ...result,
    rent_start_date: result.rent_start_date.toISOString().split('T')[0],
    rent_end_date: result.rent_end_date.toISOString().split('T')[0]
  };
  
  if (status === 'returned') {
    return {
      ...formattedResult,
      vehicle: {
        availability_status: 'available'
      }
    };
  }
  
  return formattedResult;
};

export const bookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  updateBookingByIdInDB
};