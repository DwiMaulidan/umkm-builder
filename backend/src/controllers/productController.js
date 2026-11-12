const pool = require("../config/database");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, category_id, price,
              stock, unit, min_stock, created_at
       FROM products
       WHERE business_id = $1
       ORDER BY id DESC`,
      [req.user.businessId]
    );

    return res.json({
      message: "Berhasil mengambil data produk",
      products: result.rows,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      message: "Gagal mengambil data produk",
    });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        message: "ID produk tidak valid",
      });
    }

    const result = await pool.query(
      `SELECT id, name, category, category_id, price,
              stock, unit, min_stock, created_at
       FROM products
       WHERE id = $1 AND business_id = $2`,
      [id, req.user.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    return res.json({
      message: "Berhasil mengambil detail produk",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      message: "Gagal mengambil detail produk",
    });
  }
};


const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      category_id,
      price,
      stock,
      unit,
      min_stock,
    } = req.body;

    // Validasi nama
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Nama produk wajib diisi",
      });
    }

    if (name.trim().length > 150) {
      return res.status(400).json({
        message: "Nama produk maksimal 150 karakter",
      });
    }

    // Validasi angka
    const parsedPrice = Number(price ?? 0);
    const parsedStock = Number(stock ?? 0);
    const parsedMinStock = Number(min_stock ?? 0);

    if (
      !Number.isFinite(parsedPrice) ||
      !Number.isFinite(parsedStock) ||
      !Number.isFinite(parsedMinStock)
    ) {
      return res.status(400).json({
        message: "Harga dan stok harus berupa angka yang valid",
      });
    }

    if (parsedPrice < 0 || parsedStock < 0 || parsedMinStock < 0) {
      return res.status(400).json({
        message: "Harga dan stok tidak boleh negatif",
      });
    }

    if (
      !Number.isInteger(parsedStock) ||
      !Number.isInteger(parsedMinStock)
    ) {
      return res.status(400).json({
        message: "Stok dan stok minimum harus berupa bilangan bulat",
      });
    }

    if (category != null && typeof category !== "string") {
      return res.status(400).json({
        message: "Kategori harus berupa teks",
      });
    }

    if (unit != null && typeof unit !== "string") {
      return res.status(400).json({
        message: "Satuan harus berupa teks",
      });
    }

    if (category_id != null && !/^\d+$/.test(String(category_id))) {
      return res.status(400).json({
        message: "ID kategori tidak valid",
      });
    }

    const result = await pool.query(
      `INSERT INTO products (
        business_id, name, category, category_id,
        price, stock, unit, min_stock
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, category, category_id,
                price, stock, unit, min_stock, created_at`,
      [
        req.user.businessId,
        name.trim(),
        category?.trim() || null,
        category_id ?? null,
        parsedPrice,
        parsedStock,
        unit?.trim() || null,
        parsedMinStock,
      ]
    );

    return res.status(201).json({
      message: "Produk berhasil ditambahkan",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Create product error:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Kategori tidak ditemukan atau bukan milik bisnismu",
      });
    }

    return res.status(500).json({
      message: "Gagal menambahkan produk",
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      category_id,
      price,
      stock,
      unit,
      min_stock,
    } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Tidak ada data yang diubah" });
    }

    // Ambil produk berdasarkan bisnis yang sedang login
    const existing = await pool.query(
      `SELECT * FROM products
       WHERE id = $1 AND business_id = $2`,
      [id, req.user.businessId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const old = existing.rows[0];

    const newName = name ?? old.name;
    const newCategory = category === undefined ? old.category : category;
    const newCategoryId = category_id === undefined ? old.category_id : category_id;
    const newPrice = Number(price ?? old.price);
    const newStock = Number(stock ?? old.stock);
    const newUnit = unit === undefined ? old.unit : unit;
    const newMinStock = Number(min_stock ?? old.min_stock);

    if (typeof newName !== "string" || !newName.trim()) {
      return res.status(400).json({ message: "Nama produk wajib diisi" });
    }

    if (newName.trim().length > 150) {
      return res.status(400).json({ message: "Nama maksimal 150 karakter" });
    }

    if (
      !Number.isFinite(newPrice) ||
      !Number.isFinite(newStock) ||
      !Number.isFinite(newMinStock)
    ) {
      return res.status(400).json({ message: "Harga dan stok harus berupa angka valid" });
    }

    if (newPrice < 0 || newStock < 0 || newMinStock < 0) {
      return res.status(400).json({ message: "Harga dan stok tidak boleh negatif" });
    }

    if (!Number.isInteger(newStock) || !Number.isInteger(newMinStock)) {
      return res.status(400).json({ message: "Stok harus berupa bilangan bulat" });
    }

    if (newCategory !== null && typeof newCategory !== "string") {
      return res.status(400).json({ message: "Kategori harus berupa teks" });
    }

    if (newUnit !== null && typeof newUnit !== "string") {
      return res.status(400).json({ message: "Satuan harus berupa teks" });
    }

    if (
      newCategoryId !== null &&
      !/^\d+$/.test(String(newCategoryId))
    ) {
      return res.status(400).json({ message: "ID kategori tidak valid" });
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           category = $2,
           category_id = $3,
           price = $4,
           stock = $5,
           unit = $6,
           min_stock = $7
       WHERE id = $8 AND business_id = $9
       RETURNING id, name, category, category_id,
                 price, stock, unit, min_stock, created_at`,
      [
        newName.trim(),
        newCategory?.trim() || null,
        newCategoryId,
        newPrice,
        newStock,
        newUnit?.trim() || null,
        newMinStock,
        id,
        req.user.businessId,
      ]
    );

    return res.json({
      message: "Produk berhasil diperbarui",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Kategori tidak ditemukan atau bukan milik bisnismu",
      });
    }

    return res.status(500).json({ message: "Gagal memperbarui produk" });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1 AND business_id = $2
       RETURNING id, name`,
      [id, req.user.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    return res.json({
      message: "Produk berhasil dihapus",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Delete product error:", error);

    if (error.code === "23503") {
      return res.status(409).json({
        message: "Produk tidak dapat dihapus karena sudah digunakan dalam transaksi atau riwayat stok",
      });
    }

    return res.status(500).json({ message: "Gagal menghapus produk" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};