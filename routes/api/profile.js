const express = require("express");
const router = express.Router();
const fs = require("fs");
const config = require("config");
const User = require("../../models/User");
const Blog = require("../../models/Blog");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const Jimp = require("jimp");

resize = async (file, width, height) => {
  const [image] = await Promise.all([Jimp.read(file)]);
  image.resize(width, height);
  return image;
};

dirname = process.cwd();
const LOGO = `${dirname}/public/mark.png`;

router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user:req.user.id});
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/", auth, async (req, res, next) => {
  try {
    let profile = await Profile.findOne({user:req.user.id});
    if (profile) {
      let avatar = req.files.avatar;
      let backimage = req.files.backimage;
      let name = req.body.name;
      let city = req.body.city;
      let country = req.body.country;
      let bio = req.body.bio;
      const avatarname = `${dirname}/public/avatar/` + req.user.id + `.jpg`;
      const backimgname = `${dirname}/public/backimg/` + req.user.id + `.jpg`;
      await avatar.mv(`${dirname}/public/${avatar.name}`, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        const image = await resize(`${dirname}/public/${avatar.name}`, 50, 50);
        await image.writeAsync(avatarname);
        fs.unlink(`${dirname}/public/${avatar.name}`, (err) => {
          if (err) console.log(err);
        });
      });
      await backimage.mv(`${dirname}/public/${backimage.name}`, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        const image = await resize(
          `${dirname}/public/${backimage.name}`,
          300,
          100
        );
        await image.writeAsync(backimgname);
        fs.unlink(`${dirname}/public/${backimage.name}`, (err) => {
          if (err) console.log(err);
        });
      });
      profile.avatar = "https://viavix.com/avatar/"+req.user.id+".jpg";
      profile.backimg = "https://viavix.com/backimg/"+req.user.id+".jpg";
      profile.name = name;
      profile.bio = bio;
      profile.country = country;
      profile.city = city;

      const data = await profile.save();
      return res.json(data);
    }
    return res.status(500).send(err);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
