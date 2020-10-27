const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
    secretOrKey: process.env.TOKEN_SECRET,
};

const AWS = require("aws-sdk");
const util = require('util');
AWS.config.update({
    region: "us-west-1",
    endpoint: "http://localhost:8000"
  });

const docClient = new AWS.DynamoDB.DocumentClient();

const strategy = new JwtStrategy(options, async (payload, done) => {

  let keyParams = {
      TableName: "MOCK_DB",
      ProjectionExpression: "#uid, sortKey, username, email",
      KeyConditionExpression: "#uid = :userSK and sortKey = :sortKey",
      ExpressionAttributeNames: {
            "#uid": "partitionKey",
      },
      ExpressionAttributeValues: {
            ":userSK": payload.partitionId,
            ":sortKey": payload.sortId
      }
  }

  docClient.query = util.promisify(docClient.query)
  const obtainedUser = await docClient.query(keyParams);
  if(obtainedUser) {
      return done(null, obtainedUser);
  }
  else {
      return done(null, false);
  }

});

passport.use(strategy);