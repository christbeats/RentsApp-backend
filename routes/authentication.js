const User = require("../models/userSchema")
const jwt = require('jsonwebtoken');
const fs = require('fs')
const Helpers = require('../helpers/Helper')
const uploadedFile = require('express-fileupload')
const config = require('../config/database');
var crypto = require('crypto')



require('dotenv').config()

module.exports = (router) => {

  
    router.post('/register', 
    /**
   * @param {Express.Request} req
   *  
   */  
    async (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an  email' });
        }
        else if (!req.body.phoneNumber) {

            res.json({ success: false, message: 'You must provide a phone number' });
        }

        else if (!req.body.username) {

            res.json({ success: false, message: 'You must provide a  username' });
        }

        else if (!req.body.password) {

            res.json({ success: false, message: 'You must provide a password' });
        }

        else if (!req.body.role) {

            res.json({ success: false, message: 'You must provide a role' });
        }



        else {

          try {
            
            const imagePath = await Helpers.FileController.saveFile(req.files.image, 'uploads')
            

            let user = new User({
              email: req.body.email,
              phoneNumber: req.body.phoneNumber,
              username: req.body.username,
              password: req.body.password,
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
                      else if (err.errors.role) {
                          res.json({ success: false, message: err.errors.role.message })
                      }
                      else  {
                          res.json({ success: false, message: err.errors })
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

    })





    //check phone number uniqueness in real time on client

    router.get('/checkPhonenumber/:phoneNumber', (req, res) => {
        if (req.params.phoneNumber == null) {
            res.json({ success: false, message: ' meiijsn  ezf dzedfze' })

        } else

            if (!req.params.phoneNumber) {

                res.json({ success: false, message: 'phoneNumber must be provided' })

            } else {

                User.findOne({ phoneNumber: req.params.phoneNumber }, (err, user) => {

                    if (err) {
                        res.json({ success: false, message: err });
                    } else {

                        if (user) {
                            res.json({ success: false, message: 'This phoneNumber is used by another account' });
                        }
                        else {
                            res.json({ success: true, message: 'This phoneNumber is available' });

                        }
                    }
                })
            }
    });






    //check email uniqueness in real time on client

    router.get('/checkEmail/:email', (req, res) => {

        if (!req.params.email) {

            res.json({ success: false, message: 'Email must be provided' })

        } else {

            User.findOne({ email: req.params.email }, (err, user) => {

                if (err) {
                    res.json({ success: false, message: err });
                } else {

                    if (user) {
                        res.json({ success: false, message: 'This email is used by another account' });
                    }
                    else {
                        res.json({ success: true, message: 'This email is available' });

                    }
                }
            })
        }
    });






    //check username uniqueness in real time on client

    router.get('/checkUsername/:username', (req, res) => {

        if (!req.params.username) {

            res.json({ success: false, message: 'username is required' });

        } else {

            User.findOne({ username: req.params.username }, (err, user) => {

                if (err) {
                    res.json({ success: false, message: err });
                } else {

                    if (user) {
                        res.json({ success: false, message: 'This username is used by another account' });
                    }
                    else {
                        res.json({ success: true, message: 'This username is available' });

                    }
                }
            })
        }
    })



    /********
      * 
      * LOGIN ROUTE
      * 
      */
    router.post('/login', (req, res) => {

        if (!req.body.email) {

            res.json({ success: false, message: 'No email entered' })

        } else {

            if (!req.body.password) {

                res.json({ success: false, message: 'No password entered' })

            } else {

                User.findOne({ email: req.body.email }, (err, user) => {

                    if (err) {

                        res.json({ success: false, message: err })

                    } else {

                        if (!user) {

                            res.json({ success: false, message: 'user ' + req.body.email + ' does not exist' })
                        } else {

                            const validPassword = user.comparePassword(req.body.password);

                            if (!validPassword) {

                                res.json({ success: false, message: 'Entered password does not match password of user with email: ' + req.body.email })

                            } else {

                                //creation of jsonwebtoken
                                const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })

                                res.json({ success: true, message: 'successful login', token: token, user: { id: user._id, email: user.email, username: user.username, phonenumber: user.phoneNumber, role: user.role ,image: user.image } })

                            }

                        }
                    }
                })
            }
        }
    })


    //All routes that require authorization should be place after this  (middelware used to grap token from user's header)
    // router.use((req, res, next) => {

    //     const token = req.headers['authorization'].replace(/^Bearer\s/, '');

    //     console.log('token is' + token);

    //     if (!token) {

    //         res.json({ success: false, message: 'No token provided' });

    //     } else {

    //         console.log('secret ix :' + process.env.ACCESS_TOKEN_SECRET);

    //         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {   // decodes the token using config.secret and store it in 'decoded'

    //             if (err) {

    //                 res.json({ success: false, message: 'Invalid token:' + err });

    //             } else {

    //                 req.decoded = decoded;
    //                 next();
    //             }
    //         })
    //     }
    // })

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email role').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                if (!user) {
                    res.json({ success: false, message: 'No user found' });
                } else {
                    res.json({ sucess: true, user: user });
                }
            }
        })
    })





    return router;

}