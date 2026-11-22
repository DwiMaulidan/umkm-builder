const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getIntegrations,
  getIntegrationByProvider,
  saveIntegration,
  disconnectIntegration,
} = require("../controllers/integrationController");

router.get("/", authenticateToken, getIntegrations);
router.get("/:provider", authenticateToken, getIntegrationByProvider);
router.put("/:provider", authenticateToken, saveIntegration);
router.delete("/:provider", authenticateToken, disconnectIntegration);

module.exports = router;
