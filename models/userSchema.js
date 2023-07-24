const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const path = require("path");
const multer = require("multer");

const bcrypt = require("bcrypt-nodejs");

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

/*************** Password validators ***********/
let passwordLengthChecker = (password) => {
  if (!password) {
    return false;
  } else if (password.length < 6 || password.length > 30) {
    return false;
  }
  return true;
};

let passwordStructureChecker = (password) => {
  if (!password) {
    return false;
  } else {
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,15}$/
    );
    return regex.test(password);
  }
};

let passwordValidator = [
  {
    validator: passwordLengthChecker,
    message: "password should contain between 6 and 15 characters",
  },
  {
    validator: passwordStructureChecker,
    message:
      "password should contain atleast one lowercase, one uppercase, one number and one special character",
  },
];

/*************** Confirm Password validators ***********/
// let confirmpasswordStructureChecker = (confirmpassword) => {
//     if (!confirmpassword) {
//         return false;
//     }
//     else {
//         const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,15}$/);
//         return regex.test(password);
//     }
// }

// let confirmpasswordValidator = [
//     {
//         validator: confirmpasswordStructureChecker,
//         message: 'Passwords must be the same',
//     },

// ]

/*************** Username validators ***********/
let usernameStructureChecker = (username) => {
  if (!username) {
    return false;
  } else {
    const regEx = new RegExp(/^[a-z0-9_.]+$/);
    return regEx.test(username);
  }
};

let usernameLengthChecker = (username) => {
  if (!username) {
    return false;
  } else {
    if (username.length < 2 || username.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message:
      "username should be greater than 4 characters and should be less than 15",
  },
];

/*************** Phone number validators ***********/
let phoneNumberLengthChecker = (phoneNumber) => {
  if (!phoneNumber) {
    return false;
  } else {
    if (phoneNumber.length < 6 || phoneNumber.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

//phoneNumber structure checker with regEx
let phoneNumberStructureChecker = (phoneNumber) => {
  if (!phoneNumber) {
    return false;
  } else {
    const regEx = new RegExp(/^(0|[1-9][0-9]*)$/i);
    return regEx.test(phoneNumber); //returns either true or false
  }
};

/*************** Email validators ***********/

let emailLengthChecker = (email) => {
  if (!email) {
    return false;
  } else {
    if (email.length < 6 || email.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};
//email structure checker with regEx
let emailStructureChecker = (email) => {
  if (!email) {
    return false;
  } else {
    const regEx = new RegExp(/^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i);
    return regEx.test(email); //returns either true or false
  }
};

//check wether role is
let roleTypeChecker = (role) => {
  if (!role) {
    return false;
  } else {
    if (role === "admin" || role === "seller") {
      return true;
    } else {
      return false;
    }
  }
};

const phoneNumberValidators = [
  {
    validator: phoneNumberLengthChecker,
    message: "phone Number must be more than 5 character but less than 30",
  },
  {
    validator: phoneNumberStructureChecker,
    message: "phone Number is not valid",
  },
];

const emailValidators = [
  {
    validator: emailLengthChecker,
    message: "Email must be more than 5 character but less than 30",
  },
  {
    validator: emailStructureChecker,
    message: "Email is not valid",
  },
];

const roleValidator = [
  {
    validator: roleTypeChecker,
    message: "role is either admin, owner or editor",
  },
];

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: phoneNumberValidators,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: usernameValidators,
  },
  password: {
    type: String,
    validate: passwordValidator,
  },

  role: {
    type: String,
    validate: roleValidator,
  },
  image: { 
    type: String,
     },
  lastUpdate: { type: Date },
  status: {
    type: Boolean,
    default: false,
  },
});

//hash password with bcrypt
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

//compare the encrpted password in db with the password the current user uses to login, return true if there's a match
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
