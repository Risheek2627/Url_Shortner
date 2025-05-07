const urlController = require("../controllers/urlController");
const express = require("express");
const router = express.Router();

// POST: Shorten the URL
router.post("/shortenUrl", urlController.shortenUrl);

// GET: Stats for a short URL - MUST come before the generic shortCode route
router.get("/stats/:shortCode", urlController.getStats);

// GET: Redirect to original URL - Now this won't catch /stats/xyz requests
router.get("/:shortCode", urlController.redirectUrl);

module.exports = router;
