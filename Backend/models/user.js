const pool = require("../db");
const bcrypt = require("bcryptjs");

const generatePassword = () => {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "#@";

  let password = "";
  for (let i = 0; i < 3; i++)
    password += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 2; i++)
    password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  return password;
};

const UserModel = {
  getUserByEmail: async (email) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [
        email,
      ]);
      return rows;
    } catch (err) {
      console.error("Error en getUserByEmail:", err);
      return null;
    }
  },

  createUser: async (data) => {
    try {
      const { name, lastName, email, googleId } = data;

      const [existing] = await pool.query(
        "SELECT * FROM users WHERE email=? OR google_id=?",
        [email, googleId]
      );
      if (existing.length > 0) return existing[0];

      const plainPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const [result] = await pool.query(
        `INSERT INTO users 
      (first_name,last_name,email,password,google_id,active,created_at,updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [name, lastName, email, hashedPassword, googleId, 1]
      );

      return {
        id: result.insertId,
        name,
        lastName,
        email,
        googleId,
        plainPassword,
      };
    } catch (err) {
      console.error("Error en createUser:", err);
      return null;
    }
  },
  getUserProfile: async (userId) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users_profiles WHERE user_id=?",
        [userId]
      );
      return rows;
    } catch (err) {
      console.error("Error en getUserProfile:", err);
      return null;
    }
  },

  createUserProfile: async (userId, profileData) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        address,
        urlAvatar,
        postalCode,
        city,
        country,
      } = profileData;

      const [result] = await pool.query(
        `INSERT INTO users_profiles
        (user_id, first_name,last_name,phone,address,url_avatar,postal_code,city,country,created_at,updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          firstName,
          lastName,
          phone || null,
          address || null,
          urlAvatar || null,
          postalCode || "",
          city || "",
          country || "",
        ]
      );

      return result;
    } catch (err) {
      console.error("Error en createUserProfile:", err);
      return null;
    }
  },

  updateUserProfile: async (userId, profileData) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        address,
        urlAvatar,
        postalCode,
        city,
        country,
      } = profileData;

      const [result] = await pool.query(
        `UPDATE users_profiles SET
        first_name=?, last_name=?, phone=?, address=?, url_avatar=?, postal_code=?, city=?, country=?, updated_at=NOW()
        WHERE user_id=?`,
        [
          firstName,
          lastName,
          phone || null,
          address || null,
          urlAvatar || null,
          postalCode || "",
          city || "",
          country || "",
          userId,
        ]
      );

      return result;
    } catch (err) {
      console.error("Error en updateUserProfile:", err);
      return null;
    }
  },
};

module.exports = UserModel;
