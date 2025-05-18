const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/',
    [body('email').isEmail().withMessage('Enter a valid email'),
        body('user')
            .notEmpty().withMessage('Username is required')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // If validation passes, access the data
        const { username, password } = req.body;
        console.log({ username, password });

        // Proceed to register user...
        res.json({ message: 'User registered successfully' });
    }
);

module.exports = router;
