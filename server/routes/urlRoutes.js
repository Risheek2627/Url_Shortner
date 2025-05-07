const urlController = require("../controllers/urlController");
const express = require("express");
const routes = express.Router();

//post shorten the url
routes.post("/shortenUrl", urlController.shortenUrl);

// redirect to original url
routes.get("/:shortCode", urlController.redirectUrl);

// stats
routes.get("/stats/:shortCode", urlController.getStats);
module.exports = routes;
