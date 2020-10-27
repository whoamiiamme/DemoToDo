const fs = require("fs");
const path = require("path");
const util = require("util");
const AWS = require("aws-sdk");
require("dotenv").config();

const URL = path.join(__dirname, "./../JSON/user.json");

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000",
});

const userRoles = JSON.parse(fs.readFileSync(URL, "utf-8"));
const docClient = new AWS.DynamoDB.DocumentClient();
console.log(process.env.TABLE_NAME);
userRoles.forEach(async (userRole) => {
  try {
    const params = {
      TableName: "MOCK_DB",
      Item: {
        ...userRole,
      },
    };
    docClient.put = util.promisify(docClient.put);
    await docClient.put(params);
  } catch (e) {
    console.log(e + " ");
  }
});
