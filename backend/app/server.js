const express = require("express");
// const mongoose = require("mongoose");
// const Router = require("./routes");
const cors = require("cors");

const app = express();
const db = require("./models");
const dbConfig = require("./config/db.config");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs/dist/bcrypt");

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to chrome exe application." });
});
// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  User.findOne({ isAdmin: true }).count((err, count) => {
    if (!err && count === 0) {
      const user = new User({
        isAdmin: true,
        txtEmail: "admin@exewebapp.com",
        password: bcrypt.hashSync("P@ssw0rd", 8),
      });
      user.save((err, user) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("admin@exewebapp.com registered succesfully");
        }
      });
    }
  });
}
