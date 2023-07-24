const config = require('../config/database');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const Helpers = require('../helpers/Helper')
const uploadedFile = require('express-fileupload')

const User = require("../models/userSchema")


require('dotenv').config()


module.exports = (router) => {

    /*
     CREATE USER
     */
    router.post('/create-user/', async (req, res) => {
        //check if logged-in user is allowed to create users
        //logged-in user will pass his email/username/_id hidden in the form, and we shall check it
        
        // User.find({ userId: req.params.idUser }, (err, loggeduser) => {
            // if (err) {

            //     res.json({ success: false, message: 'You are not known by the system' });
            // } else {

            //     if (!loggeduser) {

            //         res.json({ success: false, message: 'You are not recognized found' });
            //     } else {
            //        // res.json({ success: true, user: user })
            //         if (loggeduser.role !== 'admin'){
            //             res.json({ success: false, message: 'You are not allowed to perform this operation' });

            //         } else{
            //               //loggedin user has appropriate role and can proceed to create user

                        if (!req.body.email) {
                            res.json({ success: false, message: 'You must provide an  email' });
                        }
                        else if (!req.body.phoneNumber) {

                            res.json({ success: false, message: 'You must provide a phone number' });
                        }

                        else if (!req.body.username) {

                            res.json({ success: false, message: 'You must provide a  username' });
                        }



                        else {

                          try {
            
                            const imagePath = await Helpers.FileController.saveFile(req.files.image, 'uploads')
                            
                

                            let user = new User({
                                email: req.body.email,
                                phoneNumber: req.body.phoneNumber,
                                username: req.body.username,
                                role: 'seller',
                                image: imagePath,
                                status: false,
                                lastUpdate: Date.now()
                            });


                            user.save((err) => {
                                if (err) {
                                    if (err.code === 11000) {
                                        res.json({ success: false, message: 'Username, email or phone number already exists' })

                                    }
                                    else {

                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message })

                                        }

                                        else if (err.errors.phoneNumber) {
                                            res.json({ success: false, message: err.errors.phoneNumber.message })

                                        }

                                        else if (err.errors.email) {
                                            res.json({ success: false, message: err.errors.email.message })

                                        }



                                    }
                                }

                                else {
                                    res.json({ success: true, message: 'User registered successfully' });

                                }


                            })

                          } catch (error) {
                            console.log(error)
                            res.json({ success: false, message: 'Error when try to save the image!' });
                          }

                        }
                    });
                // }
    //         }

    //     })



    // })





    /*
     GET ALL USERS
     */

     router.get('/allUsers/', (req, res) => {
        User.find({}, (err, User) =>{
          if (err) {
            res.json({ success: false, message: err });
          } else {
            if (!User) {
              res.json({ success: false, message: 'No User found'});
            } else {
              res.json({ success: true, User:User });
            }
          }
        }).sort({ '_id': -1 });
      });



      /***
   * Edit single Properties 
   *
   */

/***  router.put('/allProperties/', (req, res) => {
    res.send('test')
  });  **/

  router.put('/updateUser/', (req, res) => {
    if (!req.body._id) {
      res.json({ success: false, message: 'No user id provided' });
    } else {
      user.findOne({_id: req.body._id }, (err, user) => {
        if(err) {
          res.json({ success: false, message: 'Not a valid user ID'})
        } else {
          if(!user) {
            res.json({ success: false, message: 'user ID was not found'})
          }else{
            user.email = req.body.email;
            user.phoneNumber = req.body.phoneNumber;
            user.username = req.body.username;
            user.save((err) => {
              if (err) {
                res.json({ success : false, message : err});
              }else {
                res.json({ success : true, message: 'user Updated!'})
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

  router.delete('/deleteuser/:id', (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: 'No user id provided' });
    } else {
      User.findOne({_id: req.params.id }, (err, user) => {
        if(err) {
          res.json({ success: false, message: 'Not a valid user ID'})
        } else {
          if(!user) {
            res.json({ success: false, message: 'user ID was not found'})
          }else{
            user.remove((err) => {
              if (err) {
                res.json({ success : false, message : err});
              }else {
                res.json({ success : true, message: 'user Deleted!'})
              }
            });
          }
        }
      })
    }
  });
  
    /***
     * GET USER BY EMAIL
     * 
     */

    

    /***
     * ACTIVATE/DEACTIVATE USER ACCOUNT 
     *
     */
   

    /***
    * Change the status of a user 
    * 
    */

    

    /***
    * UPDATE USER ACCOUNT
    * 
    */

  



    return router;
};
