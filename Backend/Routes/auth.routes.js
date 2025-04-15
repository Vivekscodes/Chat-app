const express = require("express");
const router = express.Router();
router.get("/register", (req, res) => {
    res.send("Auth route working fine")
})
router.get("/login", (req, res) => {
    res.send("Auth route working fine")
})
