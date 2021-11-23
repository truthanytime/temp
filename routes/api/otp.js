var express = require('express');
var router = express.Router();
const sendMail = require('../../controller/mailgun');
router.post('/',  (req, res)=> {
    const {name,email,code}=req.body;
    try {
      const sent = sendMail(name,email,code);
      if (sent!="") {
        res.send("success");
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
});
module.exports = router;