const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const upload = require("./../middlewares/upload.base64");
const constant = require("./../constant")

require("dotenv").config();

AWS.config.update({
    region: "us-west-1",
    endpoint: process.env.END_POINT
  });

const docClient = new AWS.DynamoDB.DocumentClient();

const checkUser = async (filter, string) => {
    let checkExistUserParam = {
        TableName: process.env.TABLE_NAME,
        FilterExpression: "#fil = :filter",
        ExpressionAttributeNames: {
            "#fil": string,
        },
        ExpressionAttributeValues: {
            ":filter": filter
        }
    };

    docClient.scan = util.promisify(docClient.scan)
    const existUser = await docClient.scan(checkExistUserParam);
    return existUser;
};

const updateFirstLogin = async (sortKey) => {
    let params = {
        TableName:process.env.TABLE_NAME,
        Key:{
            "partitionKey": "userPK",
            "sortKey": sortKey
        },
        UpdateExpression: "set firstLogin = :f",
        ExpressionAttributeValues:{
            ":f":1,
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.update = util.promisify(docClient.update);
    await docClient.update(params);
}

module.exports.register = async (req) => {
    const {password, email, base64Image} = req.body;
    const partitionKey = "userPK";
    const sortKey = "userSK" + uuidv4();
    
    const existEmail = await checkUser(email, "email");
    if(existEmail.Items.length !== 0) {
        throw ({status: 415, message: constant.EMAIL_USED});
    };
    
    // const existUser = await checkUser(username, "username");
    // if(existUser.Items.length !== 0) {
    //     throw ("Username Already Exist");
    // };

    let urlAva = await upload.uploadImage(base64Image, email);
    if(!urlAva) {
        urlAva = constant.DEFAULT_AVATAR
    }
    const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password + salt, salt);

    let params = {
        TableName:process.env.TABLE_NAME,
        Item:{
            "partitionKey": partitionKey,
            "sortKey": sortKey,
            // "username": username,
            "email": email,
            "password": passwordHash,
            "salt": salt,
            "ava": urlAva,
            "firstLogin": 0
        }
    };

    docClient.put = util.promisify(docClient.put);
    return await docClient.put(params);
};

module.exports.authenticate = async (req) => {
    const {email, password} = req.body;

    const obtainedUser = await checkUser(email, "email");

    if(obtainedUser.Items.length === 0) {
        throw ({status:404, message: constant.EMAIL_NOT_FOUND});
    };

    const user = obtainedUser.Items[0];

    if(user.firstLogin === 0) {
        var welcome = 1;
        await updateFirstLogin(user.sortKey);
    }

    if(await bcrypt.compare(password + user.salt, user.password)) {
        delete user.password;
        delete user.salt;
        const accessToken = await jwt.sign({partitionId: user.partitionKey, sortId: user.sortKey}, process.env.TOKEN_SECRET, {expiresIn: "1h"});
        const refreshToken = await jwt.sign({partitionId: user.partitionKey, sortId: user.sortKey}, process.env.TOKEN_SECRET);
        return {accessToken: accessToken, refreshToken: refreshToken, welcome: welcome};
    }
    else {
        throw ({status:404, message: constant.WRONG_PASSWORD});
    }
    
};

module.exports.getProfile = async (req) => {
    const { user } = req
    const id = user.Items[0].sortKey

    let params = {
        TableName: process.env.TABLE_NAME,
        Key:{
            "partitionKey": "userPK",
            "sortKey": id,
        }
    };

    docClient.get = util.promisify(docClient.get);
    const userInfo = await docClient.get(params);
    delete userInfo.Item.salt
    delete userInfo.Item.password
    return userInfo;
}