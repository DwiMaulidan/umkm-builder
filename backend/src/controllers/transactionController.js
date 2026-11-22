const pool = require("../config/database");
const { randomBytes } = require("crypto");

const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        t.id,
        t.invoice_number,
        t.total_amount,
        t.payment_method,
        t.created_at,
        c.name AS customer,
        COALESCE(
          STRING_AGG(p.name, ', ' ORDER BY p.name),
          '-'
        ) AS product,
        COALESCE(SUM(ti.quantity), 0)::int AS quantity
      FROM transactions t
      LEFT JOIN customers c
        ON c.id = t.customer_id
       AND c.business_id = t.business_id
      LEFT JOIN transaction_items ti
        ON ti.transaction_id = t.id
       AND ti.business_id = t.business_id
      LEFT JOIN products p
        ON p.id = ti.product_id
       AND p.business_id = ti.business_id
      WHERE t.business_id = $1
      GROUP BY t.id, c.name
      ORDER BY t.created_at DESC`,
      [req.user.businessId]
    );

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      message: "Gagal mengambil riwayat transaksi",
    });
  }
};

const createTransaction = async (req, res) => {
  const client = await pool.connect();
  let transactionStarted = false;

  try {
    const { customer, productId, quantity, paymentMethod } = req.body;
    const businessId = req.user.businessId;
    const parsedQuantity = Number(quantity);

    if (!customer || !customer.trim()) {
      return res.status(400).json({
        message: "Nama pelanggan harus diisi",
      });
    }

    if (
      !productId ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return res.status(400).json({
        message: "Produk atau jumlah pembelian tidak valid",
      });
    }

    await client.query("BEGIN");
    transactionStarted = true;

    const productResult = await client.query(
      `SELECT id, name, price, stock
       FROM products
       WHERE id = $1
         AND business_id = $2
         AND is_active = TRUE
       FOR UPDATE`,
      [productId, businessId]
    );

    if (productResult.rows.length === 0) {
      throw Object.assign(
        new Error("Produk tidak ditemukan"),
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    if (parsedQuantity > product.stock) {
      throw Object.assign(
        new Error("Jumlah pembelian melebihi stok tersedia"),
        { status: 400 }
      );
    }

    let customerResult = await client.query(
      `SELECT id
       FROM customers
       WHERE business_id = $1
         AND LOWER(name) = LOWER($2)
       LIMIT 1`,
      [businessId, customer.trim()]
    );

    let customerId;

    if (customerResult.rows.length > 0) {
      customerId = customerResult.rows[0].id;
    } else {
      customerResult = await client.query(
        `INSERT INTO customers (business_id, name)
         VALUES ($1, $2)
         RETURNING id`,
        [businessId, customer.trim()]
      );

      customerId = customerResult.rows[0].id;
    }

    const price = Number(product.price);
    const subtotal = price * parsedQuantity;
    const invoiceNumber =
      `INV-${Date.now()}-${randomBytes(3).toString("hex")}`;

    const transactionResult = await client.query(
      `INSERT INTO transactions (
        business_id,
        invoice_number,
        total_amount,
        payment_method,
        customer_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, invoice_number, total_amount,
                payment_method, created_at`,
      [
        businessId,
        invoiceNumber,
        subtotal,
        paymentMethod || "Cash",
        customerId,
      ]
    );

    const transaction = transactionResult.rows[0];

    await client.query(
      `INSERT INTO transaction_items (
        transaction_id,
        product_id,
        quantity,
        price,
        subtotal,
        business_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        transaction.id,
        product.id,
        parsedQuantity,
        price,
        subtotal,
        businessId,
      ]
    );

    await client.query(
      `UPDATE products
       SET stock = stock - $1
       WHERE id = $2 AND business_id = $3`,
      [parsedQuantity, product.id, businessId]
    );

    await client.query(
      `INSERT INTO stock_movements (
        business_id,
        product_id,
        movement_type,
        quantity,
        transaction_id,
        notes
      )
      VALUES ($1, $2, 'OUT', $3, $4, $5)`,
      [
        businessId,
        product.id,
        parsedQuantity,
        transaction.id,
        `Penjualan ${invoiceNumber}`,
      ]
    );

    await client.query("COMMIT");
    transactionStarted = false;

    res.status(201).json({
      message: "Transaksi berhasil disimpan",
      transaction: {
        ...transaction,
        customer: customer.trim(),
        product: product.name,
        quantity: parsedQuantity,
      },
    });
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    console.error("Create transaction error:", error);

    res.status(error.status || 500).json({
      message: error.status
        ? error.message
        : "Gagal menyimpan transaksi",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
