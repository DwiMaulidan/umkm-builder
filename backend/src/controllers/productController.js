const pool = require("../config/database");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, category_id, price,
              stock, unit, min_stock, created_at
       FROM products
       WHERE business_id = $1
        AND is_active = TRUE
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
  const {
    name,
    category,
    category_id,
    price,
    stock,
    unit,
    min_stock,
  } = req.body;

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

  const parsedPrice = Number(price ?? 0);
  const parsedStock = Number(stock ?? 0);
  const parsedMinStock = Number(min_stock ?? 0);

  if (
    !Number.isFinite(parsedPrice) ||
    !Number.isFinite(parsedStock) ||
    !Number.isFinite(parsedMinStock)
  ) {
    return res.status(400).json({
      message: "Harga dan stok harus berupa angka valid",
    });
  }

  if (parsedPrice < 0 || parsedStock < 0 || parsedMinStock < 0) {
    return res.status(400).json({
      message: "Harga dan stok tidak boleh negatif",
    });
  }

  if (!Number.isInteger(parsedStock) || !Number.isInteger(parsedMinStock)) {
    return res.status(400).json({
      message: "Stok harus berupa bilangan bulat",
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
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

    if (parsedStock > 0) {
      await client.query(
        `INSERT INTO stock_movements (
          business_id, product_id, movement_type,
          quantity, notes
        )
        VALUES ($1, $2, 'IN', $3, $4)`,
        [
          req.user.businessId,
          result.rows[0].id,
          parsedStock,
          "Stok awal produk",
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Produk berhasil ditambahkan",
      product: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create product error:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Kategori tidak ditemukan atau bukan milik bisnismu",
      });
    }

    return res.status(500).json({
      message: "Gagal menambahkan produk",
    });
  } finally {
    client.release();
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      message: "ID produk tidak valid",
    });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Tidak ada data yang diubah",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      `SELECT * FROM products
       WHERE id = $1 AND business_id = $2
       FOR UPDATE`,
      [id, req.user.businessId]
    );

    if (existing.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    const old = existing.rows[0];

    const newName = req.body.name ?? old.name;
    const newCategory =
      req.body.category === undefined
        ? old.category
        : req.body.category;
    const newCategoryId =
      req.body.category_id === undefined
        ? old.category_id
        : req.body.category_id;
    const newPrice = Number(req.body.price ?? old.price);
    const newStock = Number(req.body.stock ?? old.stock);
    const newUnit =
      req.body.unit === undefined ? old.unit : req.body.unit;
    const newMinStock = Number(req.body.min_stock ?? old.min_stock);

    if (typeof newName !== "string" || !newName.trim()) {
      throw Object.assign(new Error("Nama produk wajib diisi"), {
        status: 400,
      });
    }

    if (newName.trim().length > 150) {
      throw Object.assign(new Error("Nama maksimal 150 karakter"), {
        status: 400,
      });
    }

    if (
      !Number.isFinite(newPrice) ||
      !Number.isFinite(newStock) ||
      !Number.isFinite(newMinStock)
    ) {
      throw Object.assign(
        new Error("Harga dan stok harus berupa angka valid"),
        { status: 400 }
      );
    }

    if (newPrice < 0 || newStock < 0 || newMinStock < 0) {
      throw Object.assign(
        new Error("Harga dan stok tidak boleh negatif"),
        { status: 400 }
      );
    }

    if (!Number.isInteger(newStock) || !Number.isInteger(newMinStock)) {
      throw Object.assign(
        new Error("Stok harus berupa bilangan bulat"),
        { status: 400 }
      );
    }

    if (newCategory !== null && typeof newCategory !== "string") {
      throw Object.assign(new Error("Kategori harus berupa teks"), {
        status: 400,
      });
    }

    if (newUnit !== null && typeof newUnit !== "string") {
      throw Object.assign(new Error("Satuan harus berupa teks"), {
        status: 400,
      });
    }

    if (
      newCategoryId !== null &&
      !/^\d+$/.test(String(newCategoryId))
    ) {
      throw Object.assign(new Error("ID kategori tidak valid"), {
        status: 400,
      });
    }

    const result = await client.query(
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

    const oldStock = Number(old.stock);
    const stockDifference = newStock - oldStock;

    if (stockDifference !== 0) {
      await client.query(
        `INSERT INTO stock_movements (
          business_id, product_id, movement_type,
          quantity, notes
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
          req.user.businessId,
          id,
          stockDifference > 0 ? "IN" : "OUT",
          Math.abs(stockDifference),
          stockDifference > 0
            ? "Penambahan stok produk"
            : "Pengurangan stok produk",
        ]
      );
    }

    await client.query("COMMIT");

    return res.json({
      message: "Produk berhasil diperbarui",
      product: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Update product error:", error);

    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Kategori tidak ditemukan atau bukan milik bisnismu",
      });
    }

    return res.status(500).json({
      message: "Gagal memperbarui produk",
    });
  } finally {
    client.release();
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      message: "ID produk tidak valid",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const product = await client.query(
      `SELECT id, name, is_active
       FROM products
       WHERE id = $1 AND business_id = $2
       FOR UPDATE`,
      [id, req.user.businessId]
    );

    if (product.rows.length === 0 || !product.rows[0].is_active) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    const history = await client.query(
      `SELECT
        EXISTS (
          SELECT 1 FROM stock_movements
          WHERE product_id = $1 AND business_id = $2
        ) AS has_stock_history,
        EXISTS (
          SELECT 1 FROM transaction_items
          WHERE product_id = $1 AND business_id = $2
        ) AS has_transaction_history,
        EXISTS (
          SELECT 1 FROM purchase_items
          WHERE product_id = $1 AND business_id = $2
        ) AS has_purchase_history`,
      [id, req.user.businessId]
    );

    const hasHistory = Object.values(history.rows[0]).some(Boolean);

    if (hasHistory) {
      await client.query(
        `UPDATE products
         SET is_active = FALSE
         WHERE id = $1 AND business_id = $2`,
        [id, req.user.businessId]
      );

      await client.query("COMMIT");

      return res.json({
        message: "Produk berhasil dinonaktifkan karena memiliki riwayat",
        action: "deactivated",
        product: product.rows[0],
      });
    }

    await client.query(
      `DELETE FROM products
       WHERE id = $1 AND business_id = $2`,
      [id, req.user.businessId]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Produk berhasil dihapus permanen",
      action: "deleted",
      product: product.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Gagal menghapus produk",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};