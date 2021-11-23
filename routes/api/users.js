const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
// import normalize from 'normalize-url';

router.post(
    '/',    
    async(req, res) => {
        const { name, email, password } = req.body;
        try {
            const avatar = 
              gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
              });
      
            user = new User({
              name,
              email,
              password,
              avatar,
              vcoin:0
            });
      
            const salt = await bcrypt.genSalt(10);
      
            user.password = await bcrypt.hash(password, salt);
      
            await user.save();
      
            const payload = {
              user: {
                id: user.id
              }
            };
      
            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: '5 days' },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          } catch (err) {
            res.status(500).send(err.message);
          }
    }
);

module.exports = router;
