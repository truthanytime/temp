const express = require("express");
const mongoose = require('mongoose');
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

router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user:req.user.id});
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    const profile = await Profile.findOne({user:req.params.id});
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put("/follow/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    //selected user's follower field access
    const profile = await Profile.findOne({user:req.params.id});

    if (profile.followers.some((follower) => follower.user.toString() === req.user.id)) {
      profile.followers = profile.followers.filter(
        ({ user }) => user.toString() !== req.user.id
      );
    } else profile.followers.unshift({ user: req.user.id });

    await profile.save();

    //follwing user's following field access
    const profile_my = await Profile.findOne({user:req.user.id});

    if (profile_my.following.some((follow) => follow.user.toString() === req.params.id)) {
      profile_my.following = profile_my.following.filter(
        ({ user }) => user.toString() !== req.params.id
      );
    } else profile_my.following.unshift({ user: req.params.id });

    await profile_my.save();

    return res.json(Profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/", auth, async (req, res, next) => {
  console.log('dirname', dirname);
  try {
    let profile = await Profile.findOne({user:req.user.id});
    if (profile) {
      let avatar;
      let backimage;
      let name = req.body.name;
      let city = req.body.city;
      let country = req.body.country;
      let bio = req.body.bio;
      if(req.body.avatar==undefined){
        avatar = req.files.avatar;
        const avatarname = `${dirname}/public/avatar/` + req.user.id + `.jpg`;
        await avatar.mv(`${dirname}/public/avatar/${avatar.name}`, async (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          const image = await resize(`${dirname}/public/avatar/${avatar.name}`, 50, 50);
          await image.writeAsync(avatarname);
          fs.unlink(`${dirname}/public/avatar/${avatar.name}`, (err) => {
            if (err) console.log(err);
          });
        });
        profile.avatar = "/avatar/"+req.user.id+".jpg";
      }
      if(req.body.backimage==undefined){
        backimage = req.files.backimage;
        const backimgname = `${dirname}/public/backimg/` + req.user.id + `.jpg`;
        await backimage.mv(`${dirname}/public/backimg/${backimage.name}`, async (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          const image = await resize(
            `${dirname}/public/${backimage.name}`,
            300,
            100
          );
          await image.writeAsync(backimgname);
          fs.unlink(`${dirname}/public/backimg/${backimage.name}`, (err) => {
            if (err) console.log(err);
          });
        });
        profile.backimg = "https://troo.live/backimg/"+req.user.id+".jpg";
      }
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
