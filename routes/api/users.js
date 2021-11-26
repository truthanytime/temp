const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
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
      
            const newuser= await user.save();
            profile = new Profile({
              user:newuser._id
            });
            await profile.save();
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
