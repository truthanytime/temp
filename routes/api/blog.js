const express = require("express");
const router = express.Router();
const fs = require("fs");
const config = require("config");
const User = require("../../models/User");
const Blog = require("../../models/Blog");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
// import normalize from 'normalize-url';

const imagemark = require("../../controller/imagemark");
const exifr = require("exifr");
const { NFTStorage, Blob } = require("nft.storage");
const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDUxMTY5MjEwMzlFMDc0Q0JmM2FDMTRjNzA1MmRiMGVjNDQwMjcxM2YiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDA0NzgxMDU5MiwibmFtZSI6ImFuZ2Vsdmlhdml4bmZ0c3RvcmFnZSJ9.Jzu-lEobWzStEaZ7PVwLWT4g_HxTj89co8EhnacX6B4",
});

var ffmpeg = require("fluent-ffmpeg");

ipfsadd = async (
  originfile,
  markedfile,
  creatorid,
  desc,
  filetype,
  gpsoutput,
  saleoption
) => {
  try {
    const file1 = fs.readFileSync(originfile);
    const file2 = fs.readFileSync(markedfile);
    const originfileCid = await client.storeBlob(new Blob([file1]));
    const originfileUrl = "https://ipfs.io/ipfs/" + originfileCid;

    const markedfileCid = await client.storeBlob(new Blob([file2]));
    const markedfileUrl = "https://ipfs.io/ipfs/" + markedfileCid;

    // const obj = {
    //   name: "Viavix",
    //   Description: desc,
    //   external_url: markedfileUrl,
    //   originfileUrl: originfileUrl
    // };

    // const metadata = new Blob([JSON.stringify(obj)], {
    //   type: "application/json",
    // });
    // const metadataCid = await client.storeBlob(metadata);
    // const metadataUrl = "https://ipfs.io/ipfs/" + metadataCid;
    fs.unlink(originfile, (err) => {
      if (err) console.log(err);
    });
    fs.unlink(markedfile, (err) => {
      if (err) console.log(err);
    });
    const blog = await Blog.findOne({ originmetaurl: originfileUrl });
    if (!blog) {
      const newBlog = new Blog({
        creator: creatorid,
        description: desc,
        filetype: filetype,
        parentpost: 0,
        originmetaurl: originfileUrl,
        markedmetaurl: markedfileUrl,
        price: saleoption,
        lat: gpsoutput.latitude,
        lng: gpsoutput.longitude,
      });
      await newBlog.save();

      const user = await User.findOne({ _id: creatorid });
      let newvalue = Number(user.vcoin) + 1;
      user.vcoin = newvalue;
      await user.save();
      return true;
    } else return false;
  } catch (e) {
    return "error";
  }
};

videomark = (file) => {
  return new Promise((resolve, reject) => {
    ffmpeg(file)
      .input(`${dirname}/public/output_2400x2400.png`)
      .complexFilter("overlay=x=(main_w)/10:y=(main_h)/2")
      .videoCodec("libx264")
      .audioCodec("libmp3lame")
      .save(`${dirname}/public/21vixresult.mp4`)
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        return reject(err);
      })
      .on("end", function () {
        return resolve();
      });
  });
};
dirname = process.cwd();
const LOGO = `${dirname}/public/mark.png`;
router.post("/", auth, async (req, res, next) => {
  let mediafile = req.files.file;
  mediafile.mv(`${dirname}/public/${req.files.file.name}`, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    let metadataUrl = "";
    if (mediafile.mimetype.indexOf("video") !== -1) {
      ffmpeg.ffprobe(
        `${dirname}/public/${req.files.file.name}`,
        async function (err, metadata) {
          var meta =
            metadata.format.tags["com.apple.quicktime.location.ISO6709"];
          if (meta == undefined) return res.send("invalid");
          else {
            await videomark(`${dirname}/public/${req.files.file.name}`);
            var result = "";
            var index = 0;
            var temp = "";
            var gpsoutput = {};
            for (var i = 0; i < meta.length; i++) {
              if (meta[i] == "+" || meta[i] == "-") {
                if (index == 1) {
                  gpsoutput.latitude = Number(temp + Number(result));
                  result = "";
                } else if (index == 2) {
                  gpsoutput.longitude = Number(temp + Number(result));
                }
                index = index + 1;
                temp = meta[i];
              } else result = result + meta[i];
            }
            metadataUrl = ipfsadd(
              `${dirname}/public/${req.files.file.name}`,
              `${dirname}/public/21vixresult.mp4`,
              req.user.id,
              req.body.desc,
              "video",
              gpsoutput,
              req.body.saleoption
            ).then((metadataUrl) => {
              if (metadataUrl === false) res.send("existing");
              else if (metadataUrl === "error") res.send("failure");
              else res.send("success");
            });
          }
        }
      );
    } else if (mediafile.mimetype.indexOf("image") !== -1) {
      const file1 = fs.readFileSync(`${dirname}/public/${req.files.file.name}`);
      var gpsoutput = await exifr.gps(file1);
      if (gpsoutput == undefined) return res.send("invalid");
      else {
        const image = await imagemark.main(
          `${dirname}/public/${req.files.file.name}`,
          LOGO
        );
        await image.writeAsync(`${dirname}/public/21vixresult.jpg`);
        metadataUrl = ipfsadd(
          `${dirname}/public/${req.files.file.name}`,
          `${dirname}/public/21vixresult.jpg`,
          req.user.id,
          req.body.desc,
          "image",
          gpsoutput,
          req.body.saleoption
        ).then((metadataUrl) => {
          if (metadataUrl === false) res.send("existing");
          else if (metadataUrl === "error") res.send("failure");
          else res.send("success");
        });
      }
    }
  });
});
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/myfeed", auth, async (req, res) => {
  try {
    const blogs = await Blog.find({creator: req.user.id}).sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/myfeed/assetcount", auth, async (req, res) => {
  try {
    const images = await Blog.count({creator: req.user.id, filetype:'image'});
    const videos = await Blog.count({creator: req.user.id, filetype:'video'});
    res.json({images,videos});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put("/like/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Check if the blog has already been liked
    if (blog.likes.some((like) => like.user.toString() === req.user.id)) {
      // remove the like
      blog.likes = blog.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
    } else blog.likes.unshift({ user: req.user.id });

    await blog.save();

    return res.json(blog.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
