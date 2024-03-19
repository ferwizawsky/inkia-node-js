var loginValidator = function (req, res, next) {
  req
    .checkBody("username")
    .notEmpty()
    .withMessage("username field is required");
  req
    .checkBody("password")
    .notEmpty()
    .withMessage("Password field is required");
  req
    .asyncValidationErrors()
    .then(function () {
      next();
    })
    .catch(function (error) {
      res.status(400).send({
        error,
      });
    });
};
var registerValidator = function (req, res, next) {
  req
    .checkBody("username")
    .notEmpty()
    .withMessage("username field is required");
  req.checkBody("name").notEmpty().withMessage("Name field is required");
  req
    .checkBody("password")
    .notEmpty()
    .withMessage("Password field is required");
  req
    .asyncValidationErrors()
    .then(function () {
      next();
    })
    .catch(function (error) {
      res.status(400).send({
        error,
      });
    });
};
module.exports = (app) => {
  const controller = require("../controllers/auth.controller.js");
  var router = require("express").Router();

  router.post("/login/", loginValidator, controller.login);
  router.post("/refresh-token/", controller.refreshToken);
  router.post("/register/", registerValidator, controller.register);
  router.get("/profile/", controller.profile);

  app.use("/api/auth", router);
};
