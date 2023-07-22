const config = require("../config/database");
const Property = require("../models/propertySchema");

const User = require("../models/userSchema");
const upload = require("../models/propertySchema");

module.exports = (router) => {
  /*
     CREATE A Property
     */
  router.post("/create-property/", (req, res) => {
    // if (!req.body.userId) {
    //   res.json({ success: false, message: "You must provide a  user" });
    // } else
    if (!req.body.title) {
      res.json({ success: false, message: "You must provide a title" });
    } else if (!req.body.description) {
      res.json({ success: false, message: "You must provide a description" });
    } else if (!req.body.conditions) {
      res.json({
        success: false,
        message:
          "You must provide the conditions associated with this property",
      });
    } else if (!req.body.type) {
      res.json({
        success: false,
        message: "You must specify the type of property",
      });
    } else if (!req.body.location) {
      res.json({
        success: false,
        message: "You must specify the location of the property",
      });
    } else if (!req.body.town) {
      res.json({
        success: false,
        message: "You must specify the town of the property",
      });
    } else if (!req.body.region) {
      res.json({
        success: false,
        message: "You must specify the region of the property",
      });
    } else {
      //create shop object
      let property = new Property({
        // userId: "64b9381e791d218649d16861",
        title: req.body.title,
        description: req.body.description,
        conditions: req.body.conditions,
        type: req.body.type,
        livingroom: req.body.livingroom,
        surfaceArea: req.body.surfaceArea,
        bed: req.body.bed,
        bathroom: req.body.bathroom,
        price: req.body.price,
        location: req.body.location,
        town: req.body.town,
        region: req.body.region,
        status: req.body.status,
        isFeatured: req.body.isFeatured,
        // featuredImage: req.file.filename,
        // image1: req.file.filename,
        // image2: req.file.filename,
        // image3: req.file.filename,
        // image4: req.file.filename,
        // video: req.file.filename,

        lastUpdate: Date.now(),
      });

      property.save((err) => {
        if (err) {
          if (err.code === 11000) {
              res.json({ success: false, message: 'Sorry. This property already exists' })

          }
          else {

              if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message })

              }
              // else if (err.errors.userId) {
              //     res.json({ success: false, message: err.errors.userId.message })

              // }

              else if (err.errors.description) {
                  res.json({ success: false, message: err.errors.description.message })

              }
              else if (err.errors.conditions) {
                  res.json({ success: false, message: err.errors.conditions.message })

              }
              else if (err.errors.type) {
                  res.json({ success: false, message: err.errors.type.message })

              }
              else if (err.errors.location) {
                  res.json({ success: false, message: err.errors.location.message })

              }
              else if (err.errors.town) {
                  res.json({ success: false, message: err.errors.town.message })

              }
              else if (err.errors.region) {
                  res.json({ success: false, message: err.errors.region.message })

              }

          }
      } else {
          res.json({ success: true, message: "Property created successfully" });
        }
      })
    }
  })

  /***
   * GET ALL Properties OF SPECIFIC USER
   *
   */

  router.get("/get-property/:idUser", (req, res) => {
    if (!req.params.idUser) {
      res.json({ success: false, message: "No property name was provided" });
    } else {
      console.log(req.params.idUser);
      Property.find({ userId: req.params.idUser }, (err, property) => {
        if (err) {
          res.json({
            success: false,
            message:
              "No property for user with id: " + req.params.idUser + " found",
          });
        } else {
          if (!property) {
            res.json({ success: false, message: "No property found" });
          } else {
            res.json({ success: true, property: property });
          }
        }
      });
    }
  });

  /***
   * GET ALL IN A PARTICULAR TOWN
   *
   */
  router.get("/get-property/:town", (req, res) => {
    if (!req.params.town) {
      res.json({ success: false, message: "No town  was provided" });
    } else {
      Property.find({ town: { $regex: town, $options: "i" } })
        .then((properties) => {
          res.json({
            success: true,
            message: "successfully found properties",
            properties: properties,
          });
        })
        .catch((err) => {
          res.json({ success: false, message: "Something went wrong" });
        });
    }
  });

  /***
   * Change the status of a property
   *
   */

  router.get("/remove-property/:id", (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: "No property id was provided" });
    } else {
      Property.updateOne(
        { _id: req.params.id },
        { $set: { status: false } },
        (err, result) => {
          if (err) {
            // handle error
            res.json({
              success: false,
              message: "No property with id: " + req.params._id + " found",
            });
          } else {
            res.json({
              success: true,
              message: "Property status succesffuly changed",
            });
          }
        }
      );
    }
  });

  /***
   * Parametic search for a property
   *
   */

  router.get("/parametric-search-property/", (req, res) => {
    if (!req.body.location) {
      res.json({ success: false, message: "You must provide a  location" });
    } else if (!req.body.type) {
      res.json({ success: false, message: "You must provide a property type" });
    } else if (!req.body.price) {
      res.json({ success: false, message: "You must provide a price range" });
    } else {
      Property.find({
        price: { $gte: price },
        type: { $regex: type, $options: "i" },
        surfaceArea: { $regex: surfaceArea, $options: "i" },
      })
        .then((properties) => {
          res.json({ success: true, properties: properties });
        })
        .catch((err) => {});
    }
  });

  return router;
};
