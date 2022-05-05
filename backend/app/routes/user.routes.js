const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //admin panel api start
  app.get(
    "/api/users/subscribers/approvalStatus/:approvalStatus",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSubscribersByApprovalStatus
  );

  app.put(
    "/api/users/subscribers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateSubscriber
  );

  //subscriber-add-component.ts post; for testing only
  app.post(
    "/api/users/subscribers/create",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addSubscriber
  );
  //admin panel api end

  //pc registration api
  app.post("/api/users/subscribers", controller.registerNewCtechSubscriber);

  //exe file api
  app.get("/api/users/subscribers/:id", controller.getSubscriberById);
};
