const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET = "WOMMALA";
const fetchuser=require('../middleware/fetchuser');

// Replace with your actual User model path
const User = require('../models/User');

router.post('/createuser',
    [
        body('email')
            .isEmail()
            .withMessage('Enter a valid email'),

        body('username')
            .notEmpty()
            .withMessage('Username is required')
            .bail() // stop if empty
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const salt=await bcrypt.genSalt(10);
            const secPass=await bcrypt.hash(req.body.password,salt);

            // Create new user
            const user = await User.create({
                name: req.body.username,
                email: req.body.email,
                password: secPass
            });
            const data={
                user:{
                    id:user.id
                }
            }
            const authtoken=jwt.sign(data,JWT_SECRET);
            
            res.json({authtoken});
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);


router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Enter a valid email'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')

      
    ],
    async (req, res) => {
          const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email,password}=req.body;
        try {
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({error:"Please try to login with correct credentials"});
            }
            const passwordCompare=bcrypt.compare(password,user.password);
            if(!passwordCompare){
                return res.status(400).json({error:"Please try to login with correct credentials"});
            }
            const payload={
                user:{
                    id:user.id
            }
            }
            const authtoken=jwt.sign(payload,JWT_SECRET);
            res.json({authtoken});
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            
        }
        }
    );

    //get users details;
    router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

   
       





        


module.exports = router;
