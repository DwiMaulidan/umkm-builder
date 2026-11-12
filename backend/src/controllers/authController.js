const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
  const { name, email, password, business_name } = req.body;

  if (!name || !email || !password || !business_name) {
    return res.status(400).json({
      message: "Semua field wajib diisi",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password minimal 8 karakter",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = userResult.rows[0];

    const businessResult = await client.query(
      `INSERT INTO businesses (name)
       VALUES ($1)
       RETURNING id, name`,
      [business_name.trim()]
    );

    const business = businessResult.rows[0];

    await client.query(
      `INSERT INTO business_members (user_id, business_id, role)
       VALUES ($1, $2, 'owner')`,
      [user.id, business.id]
    );

    await client.query("COMMIT");

    const token = jwt.sign(
      {
        userId: user.id,
        businessId: business.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Registrasi berhasil",
      token,
      user,
      business,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan saat registrasi",
    });
  } finally {
    client.release();
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email dan password wajib diisi",
    });
  }

  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash,
              bm.business_id, bm.role, b.name AS business_name
       FROM users u
       JOIN business_members bm ON bm.user_id = u.id
       JOIN businesses b ON b.id = bm.business_id
       WHERE u.email = $1
       ORDER BY bm.id ASC
       LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const account = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      account.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      {
        userId: account.id,
        businessId: account.business_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
      business: {
        id: account.business_id,
        name: account.business_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan saat login",
    });
  }
};

module.exports = {
  register,
  login,
};
