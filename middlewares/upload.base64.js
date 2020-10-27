const fs = require("fs");
const path = require("path");
require('dotenv').config();

module.exports.uploadImage = async (base64Image, email) => {
    const allowExt = ["png", "jpg", "jpeg", "svg"]; 

    if(!base64Image) {
      let defaultUrl = "";
      return defaultUrl;
    }

    const base64Split = base64Image.split(';base64,');
    const base64Body = base64Split[1];
    const base64Header = base64Split[0].split('/').pop();

    if(!allowExt.includes(base64Header)) {
        throw new Error("File extension is not allowed");
    }

    filename = Date.now() + "-"+ email + "." + base64Header;
    await decode_base64(base64Body, filename);
    const url = process.env.IMG_URL + filename;

    return url;
}

const decode_base64 = (base64str , filename) => {

    var buf = Buffer.from(base64str,'base64');
  
    fs.writeFile(path.join(__dirname,'../public/avatars/',filename), buf, function(error){
      if(error){
        throw error;
      }
    });
}
