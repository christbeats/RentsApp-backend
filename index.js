const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/database");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const bodyParser = require("body-parser");
const router = express.Router();
const authentication = require("./routes/authentication")(router);
const propertyRoute = require("./routes/propertyRoute")(router);
const userManagementRoute = require("./routes/userManagementRoute")(router);

mongoose.Promise = global.Promise;
mongoose
  .connect(config.uri)
  .then((db) => {
    console.log(config.secret);
    console.log("connection successful to db: " + config.db);
  })
  .catch((err) => {
    console.log("error occured");
    console.error(err);
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var cors = require("cors");


// app.use(
//   cors({
//     origin: "http://localhost:4200",
//   })
// );

app.use("/property", propertyRoute); //when placed below authentication, you have to provide a token

app.use("/authentication", authentication);

app.use("/user", userManagementRoute);

// app.get("/", (req, res) => {
//   res.send("my name is jon");
// });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
