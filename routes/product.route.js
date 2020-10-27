const express = require("express");
const router = express.Router();
const productController = require("./../controllers/product.controller");
const passport = require("passport");
require("./../middlewares/passport");
const customPassport = require("./../middlewares/customPassport.passport")

router.post("/", customPassport.customPassport, productController.showProduct);

router.get("/single/:id", customPassport.customPassport, productController.productDetails);

router.post("/favorite", customPassport.customPassport, productController.favorite);

router.get("/favoriteList", customPassport.customPassport, productController.displayFavorList)

router.post("/disLiked", customPassport.customPassport, productController.disLiked);

router.post("/categories", customPassport.customPassport, productController.getCategories);

router.get("/search", customPassport.customPassport, productController.searchProduct);

router.get("/top", customPassport.customPassport, productController.showTopItem);

module.exports = router