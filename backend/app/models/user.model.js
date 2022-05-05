const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // email: {
    //   type: String,
    //   required: true,
    // },
    password: {
      type: String,
    },

    // ctech api fields start
    txtFullName: {
      type: String,
      // required: true,
    },
    txtCompanyName: {
      type: String,
      // required: true,
    },
    txtCity: {
      type: String,
      // required: true,
    },
    txtEmail: {
      type: String,
      // required: true,
    },
    txtTelephoneNo: {
      type: String,
      // required: true,
    },
    // ctech api fields end

    // secretKey: {
    //   type: String,
    //   // required: true,
    // },

    //**uuid + ipAddress + macAddress + hwid**
    licenseKey: {
      type: String,
      // required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "DISAPPROVED"],
      default: "PENDING",
    },
    // roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    isAdmin: {
      type: Boolean,
    },
    primaryLink: {
      type: String,
      // required: true,
    },
    secondaryLink: {
      type: String,
      // required: true,
    },
    timeoutInSeconds: {
      type: Number,
      // default: 60
      // required: true,
    },
    subscriberId: {
      type: Number
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
