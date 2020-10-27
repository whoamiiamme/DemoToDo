const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-1",
    endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

let params = {
    AttributeDefinitions: [
        {AttributeName: 'partitionKey',AttributeType: 'S'},
        {AttributeName: 'sortKey',AttributeType: 'S'},
        // {AttributeName: "liked", AttributeType: 'N'}
    ],
    KeySchema: [
        {AttributeName: 'partitionKey',KeyType: 'HASH'},
        {AttributeName: 'sortKey',KeyType: 'RANGE'}
      ],

    // GlobalSecondaryIndexes: [
    //   {
    //       IndexName: "ItemLiked",
    //         KeySchema: [
    //           {AttributeName: "partitionKey", KeyType: "HASH"}, //Partition key
    //           {AttributeName: "liked", KeyType: "RANGE"}, //Sort key
    //           ],
    //         Projection: {
    //             "ProjectionType": "ALL"
    //         },
    //         ProvisionedThroughput: {                             
    //             "ReadCapacityUnits": 1,
    //             "WriteCapacityUnits": 1
    //           }
    //         },
    // ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: 'MOCK_DB',
    StreamSpecification: {
    StreamEnabled: false
  },
  
};
dynamodb.createTable(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Created", data);
    }
  });


  