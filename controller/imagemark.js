const Jimp = require("jimp");

exports.main = async (file, LOGO) => {
  const [image, logo] = await Promise.all([Jimp.read(file), Jimp.read(LOGO)]);
  // console.log("width",image.bitmap.width);console.log("height",image.bitmap.height);
  // if (image.bitmap.width>image.bitmap.height)
  //   image.scaleToFit(800,450);
  // else
  // image.scaleToFit(320, 450);
    image.resize((450 * image.bitmap.width) / image.bitmap.height, 450);
  logo.resize(image.bitmap.width / 4, Jimp.AUTO);
  const X = image.bitmap.width / 20;
  const Y = image.bitmap.height / 2;

  return image.composite(logo, X, Y, [
    {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.1,
      opacityDest: 1,
    },
  ]);
};
exports.checkcolumn = async (file) => {
  const [image] = await Promise.all([Jimp.read(file)]);
  if (image.bitmap.width>image.bitmap.height)
    return false
  return true
};
