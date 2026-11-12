const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token tidak ditemukan",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT user_id, business_id, role
       FROM business_members
       WHERE user_id = $1 AND business_id = $2`,
      [decoded.userId, decoded.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Kamu tidak memiliki akses ke bisnis ini",
      });
    }

    req.user = {
      userId: result.rows[0].user_id,
      businessId: result.rows[0].business_id,
      role: result.rows[0].role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Token tidak valid atau sudah kedaluwarsa",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan autentikasi",
    });
  }
};

module.exports = authenticateToken;
