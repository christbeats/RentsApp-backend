const config = require("../config/database");
const Property = require("../models/propertySchema");
const Helpers = require('../helpers/Helper')

const User = require("../models/userSchema");
const upload = require("../models/propertySchema");

module.exports = (router) => {
  /*
     CREATE A Property
     */
  router.post("/create-property/", async (req, res) => {
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
      try {
        let featuredImage = await Helpers.FileController.saveFile(req.files.featuredImage, 'uploads')
        let image1 = await Helpers.FileController.saveFile(req.files.image1, 'uploads')
        let image2 = await Helpers.FileController.saveFile(req.files.image2, 'uploads')
        let image3 = await Helpers.FileController.saveFile(req.files.image3, 'uploads')
        let image4 = await Helpers.FileController.saveFile(req.files.image4, 'uploads')
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
          status: false,
          isFeatured: false,
          featuredImage: featuredImage,
          image1: image1,
          image2: image2,
          image3: image3,
          image4: image4,
  
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
      } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error when try to save the image!' });
      }
    }
  })

/***
   * GET ALL Properties 
   *
   */

  router.get('/allProperties/', (req, res) => {
    Property.find({}, (err, Property) =>{
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!Property) {
          res.json({ success: false, message: 'No property found'});
        } else {
          res.json({ success: true, Property:Property });
        }
      }
    }).sort({ '_id': -1 });
  });


  /***
   * GET single Properties 
   *
   */

  router.get('/singleproperty/:id', (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: "No property ID was provided" });
    } else {
      console.log(req.params.id);
      Property.findOne({ userId: req.params.id }, (err, property) => {
        if (err) {
          res.json({
            success: false,
            message:
              "No property for user with id: " + req.params.id + " found",
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
   * Edit single Properties 
   *
   */

/***  router.put('/allProperties/', (req, res) => {
    res.send('test')
  });  **/

  router.put('/updateProperty/', async (req, res) => {
    if (!req.body._id) {
      res.json({ success: false, message: 'No property id provided' });
    } else {
      Property.findOne({_id: req.body._id }, async (err, Property) => {
        if(err) {
          res.json({ success: false, message: 'Not a valid property ID'})
        } else {
          if(!Property) {
            res.json({ success: false, message: 'Property ID was not found'})
          }else{
            
            
            
            
if (req.files) {

  if (req.files.featuredImage){
    let featuredImage = await Helpers.FileController.saveFile(req.files.featuredImage, 'uploads')
    Property.featuredImage = featuredImage;
  }
  if (req.files.image1){
    let image1 = await Helpers.FileController.saveFile(req.files.image1, 'uploads')
    Property.image1 = image1;
  }
  if (req.files.image2){
    let image2 = await Helpers.FileController.saveFile(req.files.image2, 'uploads')
    Property.image2 = image2;
  }
  if (req.files.image3){
    let image3 = await Helpers.FileController.saveFile(req.files.image3, 'uploads')
    Property.image3 = image3;
  }
  if (req.files.image4){
    let image4 = await Helpers.FileController.saveFile(req.files.image4, 'uploads')
    Property.image4 = image4;
  }
}


            Property.title = req.body.title;
            Property.description = req.body.description;
            Property.conditions = req.body.conditions;
            Property.type = req.body.type;
            Property.livingroom = req.body.livingroom;
            Property.surfaceArea = req.body.surfaceArea;
            Property.bed = req.body.bed;
            Property.bathroom = req.body.bathroom;
            Property.price = req.body.price;
            Property.location = req.body.location;
            Property.town = req.body.town;
            Property.region = req.body.region;
            Property.save((err) => {
              if (err) {
                res.json({ success : false, message : err});
              }else {
                res.json({ success : true, message: 'Property Updated!'})
              }
            });
          }
        }
      })
    }
  });


 /***
   * delete single Properties 
   *
   */

   router.delete('/deleteproperty/:id', (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: 'No property id provided' });
    } else {
      Property.findOne({_id: req.params.id }, (err, Property) => {
        if(err) {
          res.json({ success: false, message: 'Not a valid property ID'})
        } else {
          if(!Property) {
            res.json({ success: false, message: 'Property ID was not found'})
          }else{
            Property.remove((err) => {
              if (err) {
                res.json({ success : false, message : err});
              }else {
                res.json({ success : true, message: 'Property Deleted!'})
              }
            });
          }
        }
      })
    }
  });  


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
