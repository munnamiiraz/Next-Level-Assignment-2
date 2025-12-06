import { pool } from "../../config/db";

const createVehicleIntoDB = async (vehicle: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicle;
  
  const result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, 
        availability_status) VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  return result.rows[0];
};

const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
}

const getVehicleByIdFromDB = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result.rows[0];
};

const updateVehicleByIdInDB = async (id: number, vehicle: any) => {

  const currentVehicleResult = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (currentVehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const currentVehicle = currentVehicleResult.rows[0];

  if ("vehicle_name" in vehicle) {
    currentVehicle.vehicle_name = vehicle.vehicle_name;
  }
  if ("type" in vehicle) {
    currentVehicle.type = vehicle.type;
  }
  if ("registration_number" in vehicle) {
    currentVehicle.registration_number = vehicle.registration_number;
  }
  if ("daily_rent_price" in vehicle) {
    currentVehicle.daily_rent_price = vehicle.daily_rent_price;
  }
  if ("availability_status" in vehicle) {
    currentVehicle.availability_status = vehicle.availability_status;
  }
  
  const result = await pool.query(
    `UPDATE vehicles SET 
      vehicle_name = $1, 
      type = $2, 
      registration_number = $3, 
      daily_rent_price = $4, 
      availability_status = $5 
     WHERE id = $6 RETURNING *`,
    [currentVehicle.vehicle_name, currentVehicle.type, currentVehicle.registration_number, currentVehicle.daily_rent_price, currentVehicle.availability_status, id]
  );
  return result.rows[0];
};

const deleteVehicleByIdFromDB = async (id: number) => {
  const vehicleCheck = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (vehicleCheck.rows.length === 0) {
    throw new Error('Vehicle not found');
  }
  
  const activeBookings = await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [id]);
  if (activeBookings.rows.length > 0) {
    throw new Error('Cannot delete vehicle with active bookings');
  }

  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) {
    throw new Error('Vehicle could not be deleted');
  }
  return;
};



export const vehicleServices = {
  createVehicleIntoDB,
  getAllVehiclesFromDB,
  getVehicleByIdFromDB,
  updateVehicleByIdInDB,
  deleteVehicleByIdFromDB
};
