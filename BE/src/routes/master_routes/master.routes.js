const express = require("express");
const router = express.Router();
const Joi = require("joi");

const routesData = require("./routes.data.json");

// Import Controllers
const UserController = require("../../controllers/master_controller/UserController");
const EmployeeController = require("../../controllers/master_controller/EmployeeController");
const ProsesController = require("../../controllers/master_controller/ProsesController");
const TargetController = require("../../controllers/master_controller/TargetController");
const MrController = require("../../controllers/master_controller/MrController");
const CandraController = require("../../controllers/master_controller/CandraController");
const UploadController = require("../../controllers/master_controller/UpdateController");
const DashboardController = require("../../controllers/master_controller/DashboardController");
const LogController = require("../../controllers/master_controller/LogController");

// Import Middleware Upload
const { upload } = require("../../services/upload");

const controllers = {
  UserController,
  EmployeeController,
  ProsesController,
  TargetController,
  MrController,
  CandraController,
  UploadController,
  DashboardController,
  LogController,
};

const middlewares = {
  "upload.single": upload.single("file"),
};

// Skema Validasi Route
const routeSchema = Joi.object({
  method: Joi.string().valid("get", "post", "put", "delete").required(),
  path: Joi.string().required(),
  controller: Joi.string().required(),
  middleware: Joi.string().optional(),
});

// Looping dan Generate Routes
routesData.forEach((route) => {
  const { error } = routeSchema.validate(route);
  if (error) {
    console.error(
      `Invalid route configuration for path '${route.path}': ${error.details[0].message}`
    );
    return;
  }

  const [controllerName, methodName] = route.controller.split(".");
  const controller = controllers[controllerName];

  if (controller && typeof controller[methodName] === "function") {
    const middleware = route.middleware ? middlewares[route.middleware] : null;

    if (middleware) {
      router[route.method](route.path, middleware, controller[methodName]);
    } else {
      router[route.method](route.path, controller[methodName]);
    }
  }
});

module.exports = router;
