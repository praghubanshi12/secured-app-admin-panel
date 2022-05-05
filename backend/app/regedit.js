var regeditApi = require("regedit");

exports.listReg = () => {
  regeditApi.list("HKCU\\SOFTWARE\\ChromeApp", function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    return {
      message: "Your request has already been sent. We'll back shortly!",
    };
  });
};

exports.putRegValue = (userId) => {
  regeditApi.putValue(
    {
      "HKCU\\SOFTWARE\\ChromeApp": {
        RegisteredID: {
          value: userId,
          type: "REG_SZ",
        },
      },
    },
    function (err) {
      if (err) console.log("err", err);
    }
  );
};

exports.createRegKey = () => {
  regeditApi.createKey("HKCU\\SOFTWARE\\ChromeApp\\", function (err) {
    if (err) {
      console.log(err);
      return;
    }
  });
};

// module.exports = regeditHelper;
