const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const path = require("path");
const multer = require("multer");

//********storage***********
let storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

// ***********StoreImage************
let uploadImage = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
      callback(null, true);
    } else {
      console.log("only jpg and png file supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).single("testImage");

// ***********StoreVideo************
let uploadVideo = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/mp4") {
      callback(null, true);
    } else {
      console.log("only mp4 file supported");
      callback(null, false);
    }
  },
}).single("testVideo");

/*************** Title validators ***********/

let titleLengthChecker = (title) => {
  if (!title) {
    return false;
  } else {
    if (title.length < 6 || title.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

const titleValidators = [
  {
    validator: titleLengthChecker,
    message: "Title must be more than 6 character but less than 30",
  },
];

/*************** Description validators ***********/

let descriptionLengthChecker = (description) => {
  if (!description) {
    return false;
  } else {
    if (description.length < 6 || description.length > 3000) {
      return false;
    } else {
      return true;
    }
  }
};

const descriptionValidators = [
  {
    validator: descriptionLengthChecker,
    message: "Description must be more than 2 character but less than 3000",
  },
];

/*************** type validators ***********/

let typeChecker = (type) => {
  if (type == "room" || type == "appartment" || type == "house") {
    return true;
  } else {
    return false;
  }
};

const typeValidators = [
  {
    validator: typeChecker,
    message: "type must be Room, Appartment or House",
  },
];

/*************** region validators ***********/

let regionChecker = (region) => {
  if (
    region == "center" ||
    region == "south" ||
    region == "south-west" ||
    region == "east" ||
    region == "north-west" ||
    region == "adamawa" ||
    region == "west" ||
    region == "litoral" ||
    region == "far-north" ||
    region == "north"
  ) {
    return true;
  } else {
    return false;
  }
};

const regionValidators = [
  {
    validator: regionChecker,
    message: "region must be valid",
  },
];

/*************** status validators 

let statusChecker = (status) => {
    if (status == 'available' ||
       
        status == 'unavailable') {
        return true;
    } else {
        return true;
    }
} 


const statusValidators = [
    {
        validator: statusChecker,
        message: 'region must be valid'
    }

] ***********/

const Schema = mongoose.Schema;
const propertySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: titleValidators,
  },
  description: {
    type: String,
    required: true,

    validate: descriptionValidators,
  },
  conditions: {
    type: String,
    required: true,

    validate: descriptionValidators,
  },
  type: {
    type: String,
    required: true,
    lowercase: true,
    validate: typeValidators,
  },
  surfaceArea: {
    type: String,
  },
  livingroom: {
    type: Number,
  },
  bed: {
    type: Number,
  },
  bathroom: {
    type: Number,
  },
  price: {
    type: String,
  },
  location: {
    type: String,
    required: true,
    lowercase: true,
  },
  town: {
    type: String,
    required: true,
    lowercase: true,
  },
  region: {
    type: String,
    required: true,
    lowercase: true,
    validate: regionValidators,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },

  isFeatured: {
    type: Boolean,
    required: true,
    default: false,
  },
  featuredImage: {
    type: String,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  image3: {
    type: String,
  },
  image4: {
    type: String,
  },

  lastUpdate: { type: Date },
});

module.exports = mongoose.model("Property", propertySchema);
