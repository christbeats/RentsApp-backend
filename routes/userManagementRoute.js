const config = require('../config/database');
const jwt = require('jsonwebtoken');

const User = require("../models/userSchema")


require('dotenv').config()


module.exports = (router) => {

    /*
     CREATE USER
     */
    router.post('/create-user/', (req, res) => {
        //check if logged-in user is allowed to create users
        //logged-in user will pass his email/username/_id hidden in the form, and we shall check it
        
        // User.find({ userId: req.params.idUser }, (err, loggeduser) => {
            // if (err) {

            //     res.json({ success: false, message: 'You are not known by the system' });
            // } else {

            //     if (!loggeduser) {

            //         res.json({ success: false, message: 'You are not recognized found' });
            //     } else {
            //        // res.json({ success: true, property: property })
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

                        else if (!req.body.role) {

                            res.json({ success: false, message: 'You must provide a role' });
                        }



                        else {
                            let user = new User({
                                email: req.body.email,
                                phoneNumber: req.body.phoneNumber,
                                username: req.body.username,
                                role: 'seller',
                                status: true,
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


                                        else if (err.errors.password) {
                                            res.json({ success: false, message: err.errors.password.message })

                                        }



                                    }
                                }

                                else {
                                    res.json({ success: true, message: 'User registered successfully' });

                                }


                            })


                        }
                    })
                // }
    //         }

    //     })



    // })





    /*
     GET ALL USERS
     */
  
    /***
     * GET USER BY EMAIL
     * 
     */

    

    /***
     * ACTIVATE/DEACTIVATE USER ACCOUNT 
     *
     */
   

    /***
    * Change the status of a property 
    * 
    */

    

    /***
    * UPDATE USER ACCOUNT
    * 
    */

  



    return router;
}
