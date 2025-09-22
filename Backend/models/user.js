require("dotenv").config();
const pool = require("../db");

const UserModel = {

  getUserByEmail: async (email) => {
    try {
      let sql = "SELECT * FROM users WHERE email=?";
      let [rows] = await pool.query(sql, [email]);
      return rows;
    } catch (err) {
      console.error("Error en getUserByEmail:", err);
      return null
    }
  },
};

module.exports = UserModel;
