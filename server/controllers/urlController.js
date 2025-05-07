const shortid = require("shortid");
const express = require("express");
const QRCode = require("qrcode");
const Url = require("../models/Url");
const dotenv = require("dotenv");
const geoip = require("geoip-lite"); // Import geoip-lite
dotenv.config();

const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: "Long Url is required" });
  }

  try {
    let existing = await Url.findOne({ longUrl });
    if (existing) {
      return res.json({ shortUrl: existing.shortUrl });
    }

    const shortCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl);
    console.log("Base url : ", process.env.BASE_URL);
    //save to db;
    const newUrl = new Url({
      shortCode,
      longUrl,
      shortUrl,
    });

    await newUrl.save();
    return res.status(201).json({ shortUrl, shortCode, longUrl, qrCode });
  } catch (err) {
    console.error("Error in shortenUrl:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const redirectUrl = async (req, res) => {
  const shortCode = req.params.shortCode;
  try {
    // Get IP address from the request
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // remove '::ffff:' prefix if present (common in IPv4-mapped IPv6)
    const normalizedIp = ip.includes("::ffff:") ? ip.split("::ffff:")[1] : ip;
    // Look up the location based on IP
    const geo = geoip.lookup(normalizedIp);

    const url = await Url.findOne({ shortCode });

    console.log("Url : ", url);

    if (!url) {
      return res.status(404).json({ message: "Short url not found" });
    }

    if (url.expiry < Date.now()) {
      return res.status(400).json({ message: "Url is expried" });
    }

    url.clickCount += 1;

    console.log(
      "IP:",
      normalizedIp,
      "Country:",
      geo?.country,
      "City:",
      geo?.city
    );
    await url.save();

    return res.redirect(url.longUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    console.log("Received shortCode:", shortCode);
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }

    return res.status(200).json({
      shortCode: url.shortCode,
      shortUrl: url.shortUrl,
      longUrl: url.longUrl,
      clickCount: url.clickCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving stats" });
  }
};
module.exports = { shortenUrl, redirectUrl, getStats };
