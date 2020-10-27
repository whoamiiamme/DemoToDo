const express = require("express")
const router = express.Router();
const userController = require("./../controllers/user.controller");
const validator = require("./../middlewares/input.validate");
// const upload = require("./../middlewares/upload.multer");
const passport = require("passport");
require("./../middlewares/passport");
const customPassport = require("./../middlewares/customPassport.passport")
const uploadImage = require("./../middlewares/upload.base64");

router.post("/register", validator.validateInput, userController.register);

router.post("/login", userController.login);

router.get("/profile", customPassport.customPassport, userController.getProfile);

router.post("/logout", (req, res) => {
    req.logout();
    res.status(200).send({
        Message: "Logout Succesful"
    })
});

// router.post("/upload", uploadImage.uploadImage, (req, res) => {
//     res.send("IMAGE SAVED")
// })

module.exports = router