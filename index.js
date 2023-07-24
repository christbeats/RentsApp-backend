const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/database");
const fileUpload = require('express-fileupload')
const url = require('url')
const bodyParser = require("body-parser");
const router = express.Router();

// express.static(root, [options])



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
var cors = require("cors");
const path = require("path");

app.use('/static', express.static(path.join(__dirname, 'public')))


app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// file save configuration
app.use(fileUpload())


const authentication = require("./routes/authentication")(router);
const propertyRoute = require("./routes/propertyRoute")(router);
const userManagementRoute = require("./routes/userManagementRoute")(router);



app.use("/property", propertyRoute); //when placed below authentication, you have to provide a token

app.use("/authentication", authentication);

app.use("/user", userManagementRoute);




// app.get("/", (req, res) => {
//   res.send("my name is jon");
// });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
