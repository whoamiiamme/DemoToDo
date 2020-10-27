const express = require("express");
const router = express.Router();
const tokenController = require("./../controllers/token.controller");

router.post("/accessToken", tokenController.getNewToken);

module.exports = router