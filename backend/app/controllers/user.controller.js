const base64 = require("base-64");
const User = require("../models/user.model");
const regeditHelper = require("../regedit");
const mailSenderHelper = require("../helpers/mailSender");

exports.updateSubscriber = (req, res) => {
  const subscriber = new User(req.body);
  let passWord = subscriber.password;
  subscriber.password = base64.encode(passWord);

  User.findByIdAndUpdate(
    { _id: subscriber._id },
    subscriber,
    {
      new: true,
    },
    (err, result) => {
      console.log("Result", result);
      if (err || !result) {
        res.status(500).send({ message: err });
      }
      console.log(result);
      mailSenderHelper.send(
        res,
        result.txtFullName,
        result.txtEmail,
        passWord,
        result.approvalStatus
      );
      res.status(200).send({
        message:
          "Subscriber status updated to : " +
          result.approvalStatus +
          " . An email has been sent",
      });
    }
  );
};

//for testing only
exports.addSubscriber = (req, res) => {
  console.log("hello");
  const newSubscriber = new User({
    email: req.body.email,
    isAdmin: false,
    approvalStatus: "PENDING",
  });

  newSubscriber.save((err, subscriber) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!subscriber) {
      res.status(500).send({ message: "Internal server error" });
      return;
    }

    res.status(200).send(subscriber);
  });
};

exports.getSubscribersByApprovalStatus = (req, res) => {
  User.find(
    {
      isAdmin: false,
      approvalStatus: req.params.approvalStatus,
    },
    (err, subscribers) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send(subscribers);
    }
  );
};

exports.getSubscriberById = (req, res) => {
  console.log(req.params.id);
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      res.status(401).send({ message: "Bad Request. User not found" });
    }
    console.log("user", user);
    res.status(200).send(user);
  });
};

exports.registerNewCtechSubscriber = async (req, res) => {
  // req.body.isApproved = false;
  req.body.isAdmin = false;

  User.find(
    {
      isAdmin: false,
    },
    (err, subscribers) => {
      let latestSubscriberId = 1;
      if (!err && subscribers.length > 0) {
        latestSubscriberId =
          subscribers[subscribers.length - 1]["subscriberId"] + 1;
      }
      req.body.subscriberId = latestSubscriberId;
      req.body.timeoutInSeconds = 60;

      let licenseKeyConcat =
        req.body.uuid +
        "|" +
        req.body.ipaddress +
        "|" +
        req.body.macid +
        "|" +
        req.body.hwid;

      console.log(licenseKeyConcat);

      // req.body.password = base64.encode(req.body.password);
      req.body.licenseKey = base64.encode(licenseKeyConcat);

      const newSubscriber = new User(req.body);

      newSubscriber.save((err, subscriber) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!subscriber) {
          res.status(500).send({ message: "Internal server error" });
          return;
        }
        console.log(subscriber._id);
        regeditHelper.createRegKey();
        regeditHelper.putRegValue(subscriber._id);
        res.status(200).send({
          message:
            "Your request has been sent. We'll send you an email regarding approval status very soon. Thank you.",
        });
      });
    }
  );
};
