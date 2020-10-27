const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-1",
    endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

let param = {
    TableName: "MOCK_DB",
    AttributeDefinitions:[
        {AttributeName: "partitionKey", AttributeType: "S"},
        {AttributeName: "liked", AttributeType: "N"}
    ],
    GlobalSecondaryIndexUpdates: [
        {
            Create: {
                IndexName: "ItemLiked",
                KeySchema: [
                    {AttributeName: "partitionKey", KeyType: "HASH"}, //Partition key
                    {AttributeName: "liked", KeyType: "RANGE"}, //Sort key
                ],
                Projection: {
                    "ProjectionType": "ALL"
                },
                ProvisionedThroughput: {                                // Only specified if using provisioned mode
                    "ReadCapacityUnits": 1,"WriteCapacityUnits": 1
                }
            },
            // Delete: {
            //     IndexName: "ItemLiked"
            // }
        }
    ]
  };

  dynamodb.updateTable(param, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Updated", data);
    }
  });