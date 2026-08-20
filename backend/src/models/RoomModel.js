const { query } = require('../config/db');

class RoomModel {
  static async getAll() {
    const sql = `SELECT * FROM rooms ORDER BY building ASC, room_number ASC`;
    return await query(sql);
  }

  static async findById(id) {
    const sql = `SELECT * FROM rooms WHERE id = ? LIMIT 1`;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ roomNumber, building, capacity, roomType = 'CLASSROOM' }) {
    const sql = `
      INSERT INTO rooms (room_number, building, capacity, room_type)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [roomNumber, building, capacity, roomType]);
    return result.insertId;
  }
}

module.exports = RoomModel;
