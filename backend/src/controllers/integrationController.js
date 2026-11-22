const pool = require("../config/database");

// Provider yang diizinkan (sesuai 6 kartu di halaman Integrasi)
const ALLOWED_PROVIDERS = [
  "whatsapp",
  "qris",
  "printer",
  "payment_gateway",
  "courier",
  "multi_outlet",
];

const MAX_CONFIG_BYTES = 10 * 1024; // 10 KB per integrasi

// Kolom yang boleh dikirim ke frontend (credentials_encrypted TIDAK ikut)
const PUBLIC_COLUMNS = `id, provider, config, status, created_at, updated_at`;

const isValidProvider = (provider) => ALLOWED_PROVIDERS.includes(provider);

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const canManage = (req) => ["owner", "admin"].includes(req.user.role);

// GET /api/integrations
const getIntegrations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${PUBLIC_COLUMNS}
       FROM integrations
       WHERE business_id = $1
       ORDER BY provider ASC`,
      [req.user.businessId]
    );

    return res.json({
      message: "Berhasil mengambil data integrasi",
      integrations: result.rows,
    });
  } catch (error) {
    console.error("Get integrations error:", error);
    return res.status(500).json({
      message: "Gagal mengambil data integrasi",
    });
  }
};

// GET /api/integrations/:provider
const getIntegrationByProvider = async (req, res) => {
  try {
    const { provider } = req.params;

    if (!isValidProvider(provider)) {
      return res.status(400).json({
        message: "Provider integrasi tidak valid",
      });
    }

    const result = await pool.query(
      `SELECT ${PUBLIC_COLUMNS}
       FROM integrations
       WHERE business_id = $1 AND provider = $2
       ORDER BY id DESC
       LIMIT 1`,
      [req.user.businessId, provider]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Integrasi belum dihubungkan",
      });
    }

    return res.json({
      message: "Berhasil mengambil detail integrasi",
      integration: result.rows[0],
    });
  } catch (error) {
    console.error("Get integration error:", error);
    return res.status(500).json({
      message: "Gagal mengambil detail integrasi",
    });
  }
};

// PUT /api/integrations/:provider
// Menghubungkan integrasi (jika belum ada) atau memperbarui konfigurasinya.
const saveIntegration = async (req, res) => {
  try {
    if (!canManage(req)) {
      return res.status(403).json({
        message: "Hanya owner atau admin yang dapat mengelola integrasi",
      });
    }

    const { provider } = req.params;
    const { config } = req.body;

    if (!isValidProvider(provider)) {
      return res.status(400).json({
        message: "Provider integrasi tidak valid",
      });
    }

    if (!isPlainObject(config)) {
      return res.status(400).json({
        message: "Config harus berupa objek",
      });
    }

    const configJson = JSON.stringify(config);

    if (Buffer.byteLength(configJson, "utf8") > MAX_CONFIG_BYTES) {
      return res.status(400).json({
        message: "Config terlalu besar (maksimal 10 KB)",
      });
    }

    const updated = await pool.query(
      `UPDATE integrations
       SET config = $3::jsonb,
           status = 'active',
           updated_at = CURRENT_TIMESTAMP
       WHERE business_id = $1 AND provider = $2
       RETURNING ${PUBLIC_COLUMNS}`,
      [req.user.businessId, provider, configJson]
    );

    if (updated.rows.length > 0) {
      return res.json({
        message: "Integrasi berhasil diperbarui",
        integration: updated.rows[0],
      });
    }

    const created = await pool.query(
      `INSERT INTO integrations (business_id, provider, config, status)
       VALUES ($1, $2, $3::jsonb, 'active')
       RETURNING ${PUBLIC_COLUMNS}`,
      [req.user.businessId, provider, configJson]
    );

    return res.status(201).json({
      message: "Integrasi berhasil dihubungkan",
      integration: created.rows[0],
    });
  } catch (error) {
    console.error("Save integration error:", error);
    return res.status(500).json({
      message: "Gagal menyimpan integrasi",
    });
  }
};

// DELETE /api/integrations/:provider
// Memutuskan integrasi: status menjadi 'inactive', config tetap disimpan.
const disconnectIntegration = async (req, res) => {
  try {
    if (!canManage(req)) {
      return res.status(403).json({
        message: "Hanya owner atau admin yang dapat mengelola integrasi",
      });
    }

    const { provider } = req.params;

    if (!isValidProvider(provider)) {
      return res.status(400).json({
        message: "Provider integrasi tidak valid",
      });
    }

    const result = await pool.query(
      `UPDATE integrations
       SET status = 'inactive',
           updated_at = CURRENT_TIMESTAMP
       WHERE business_id = $1 AND provider = $2
       RETURNING ${PUBLIC_COLUMNS}`,
      [req.user.businessId, provider]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Integrasi tidak ditemukan",
      });
    }

    return res.json({
      message: "Integrasi berhasil diputuskan",
      integration: result.rows[0],
    });
  } catch (error) {
    console.error("Disconnect integration error:", error);
    return res.status(500).json({
      message: "Gagal memutuskan integrasi",
    });
  }
};

module.exports = {
  getIntegrations,
  getIntegrationByProvider,
  saveIntegration,
  disconnectIntegration,
};
