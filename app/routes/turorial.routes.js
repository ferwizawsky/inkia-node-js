const authenticateToken = require("../../middleware/auth");

module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  router.post("/", authenticateToken, tutorials.create);
  router.get("/", authenticateToken, tutorials.findAll);
  // router.post("/", authenticateToken, tutorials.create);
  // router.get("/", authenticateToken, tutorials.findAll);
  router.get("/published", tutorials.findAllPublished);
  router.get("/:id", tutorials.findOne);
  router.put("/:id", tutorials.update);
  router.delete("/:id", tutorials.delete);
  // router.delete("/", tutorials.deleteAll);
  app.use("/api/tutorials", router);
};
