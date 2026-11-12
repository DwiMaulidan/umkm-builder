const pool = require("../config/database");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, created_at
       FROM categories
       WHERE business_id = $1
       ORDER BY name ASC`,
      [req.user.businessId]
    );

    return res.json({
      message: "Berhasil mengambil kategori",
      categories: result.rows,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      message: "Gagal mengambil kategori",
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        message: "Nama kategori maksimal 100 karakter",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (business_id, name)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
      [req.user.businessId, name.trim()]
    );

    return res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      category: result.rows[0],
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Kategori dengan nama tersebut sudah ada",
      });
    }

    return res.status(500).json({
      message: "Gagal menambahkan kategori",
    });
  }
};


const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        message: "ID kategori tidak valid",
      });
    }

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        message: "Nama kategori maksimal 100 karakter",
      });
    }

    const result = await pool.query(
      `UPDATE categories
       SET name = $1
       WHERE id = $2 AND business_id = $3
       RETURNING id, name, created_at`,
      [name.trim(), id, req.user.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    return res.json({
      message: "Kategori berhasil diperbarui",
      category: result.rows[0],
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Kategori dengan nama tersebut sudah ada",
      });
    }

    return res.status(500).json({
      message: "Gagal memperbarui kategori",
    });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        message: "ID kategori tidak valid",
      });
    }

    const result = await pool.query(
      `DELETE FROM categories
       WHERE id = $1 AND business_id = $2
       RETURNING id, name`,
      [id, req.user.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    return res.json({
      message: "Kategori berhasil dihapus",
      category: result.rows[0],
    });
  } catch (error) {
    console.error("Delete category error:", error);

    if (error.code === "23503") {
      return res.status(409).json({
        message: "Kategori tidak dapat dihapus karena masih digunakan produk",
      });
    }

    return res.status(500).json({
      message: "Gagal menghapus kategori",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
