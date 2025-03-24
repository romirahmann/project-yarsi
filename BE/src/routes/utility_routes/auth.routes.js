var express = require("express");
var router = express.Router();

const AuthController = require("../../controllers/auth_controller/authController");

router.post("/login", AuthController.login);

module.exports = router;
