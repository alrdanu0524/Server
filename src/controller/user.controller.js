const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const JWT_TOKEN = process.env.JWT_TOKEN

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as per your application needs
  host: "localhost",
  user: "root",
  password: "dcs2019",
  database: "esoft",
});



const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = `SELECT * FROM tb_user WHERE email = ?`;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection from pool:", err);
        return res.status(500).json({ error: "Server error during login." });
      }

      connection.query(query, [email], async (error, results) => {
        connection.release();
        if (error) {
          console.error("Login error:", error);
          return res.status(500).json({ error: "Server error during login." });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Invalid email or password." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        const userType = user.userType;
        console.log(userType)
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        const token = jwt.sign({firstName:user.firstName,email:user.email,lastName:user.lastName,userTypes:user.userType,uuid:user.uuid},JWT_TOKEN,{expiresIn:"1h"})
        return res.status(200).json({ message: "Login successful.",token,userType: user.userType});
      });
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
};



const signup = async (req, res) => {
  const { firstName, lastName, contact, userType, email, password,uuid } = req.body;
console.log(uuid)
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO tb_user (firstName, lastName, contact, userType, email, password,uuid)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;

    // Use the pool to get a connection and execute the query
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection from pool:", err);
        return res.status(500).json({ error: "Server error during signup." });
      }

      connection.query(
        query,
        [firstName, lastName, contact, userType, email, hashedPassword,uuid],
        (error, results) => {
          connection.release(); // Release the connection back to the pool
          if (error) {
            console.error("Signup error:", error);
            return res
              .status(500)
              .json({ error: "Server error during signup." });
          }

          return res.status(201).json({ message: "Signup successful." });
        }
      );
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ error: "Server error during signup." });
  }
};

async function getUserData(req,res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({msg:"Unauthorized"});
    }
    const _tokenData = token.split(" ")[1];

    const _decoded = jwt.verify(_tokenData,JWT_TOKEN);
    const id = _decoded._id;
    const user = await usermodel.

    33
  } catch (error) {
    console.log(error)
    res.status(500).json({msg: "Server Side Error"});
  }
  
}

module.exports = { signup,login,getUserData };
