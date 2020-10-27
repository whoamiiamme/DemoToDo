const AWS = require("aws-sdk");
const util = require('util');
const _ = require("lodash");
require("dotenv").config();
const constant = require("./../constant")

AWS.config.update({
    region: "us-west-1",
    endpoint: process.env.END_POINT
    });

const docClient = new AWS.DynamoDB.DocumentClient();

const checksingleFavorProduct = async (userId, sortId) => {
    let checkFavoritedParams = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#id = :partitionKey and sortKey = :sortKey",
        ExpressionAttributeNames: {
            "#id": "partitionKey",
        },
        ExpressionAttributeValues: {
            ":partitionKey": userId,
            ":sortKey": sortId
        }
    };

    docClient.query = util.promisify(docClient.query)
    const favoritedItem = await docClient.query(checkFavoritedParams);

    return favoritedItem;
};

const getSingleCategory = async (category, limit, ExclusiveStartKey) => {
    let params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#id = :partitionKey",
        ExpressionAttributeNames: {
            "#id": "partitionKey",
        },
        ExpressionAttributeValues: {
            ":partitionKey": category,
        },
        Limit: limit,
        ExclusiveStartKey: ExclusiveStartKey
    };

    docClient.query = util.promisify(docClient.query)
    const categoryItems = await docClient.query(params);
    return categoryItems;
};

const showfavorList = async (req) => {
    const userSortKey = req.user.Items[0].sortKey;
    let params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#id = :userSortKey",
        ExpressionAttributeNames: {
            "#id":"partitionKey"
        },
        ExpressionAttributeValues: {
            ":userSortKey": userSortKey
        },
    };

    docClient.query = util.promisify(docClient.query);
    const items = await docClient.query(params);
    return items;
};

module.exports.showProduct = async (req) => {
    const limit = req.body.limit;
    if(req.body.ExclusiveStartKey === "" || req.body.ExclusiveStartKey === undefined) {
        var params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "#id = :partitionKey",
            ExpressionAttributeNames: {
                "#id":"partitionKey"
            },
            ExpressionAttributeValues: {
                ":partitionKey":"itemPK"
    
            },
            Limit: limit,
        }
    }
    else {
        var params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "#id = :partitionKey",
            ExpressionAttributeNames: {
                "#id":"partitionKey"
            },
            ExpressionAttributeValues: {
                ":partitionKey":"itemPK"
    
            },
            Limit: limit,
            ExclusiveStartKey: req.body.ExclusiveStartKey
        }
    }

    docClient.query = util.promisify(docClient.query);
    const product = await docClient.query(params);

    const favorList = await showfavorList(req);
  
    for(let i = 0; i < favorList.Items.length; i++) {
        for(let j = 0; j < product.Items.length; j++) {
            if(favorList.Items[i].sortKey === product.Items[j].sortKey) {
                product.Items[j].turnOnLiked = 1;
            }
        }
    }

    return product;

};


module.exports.productDetails = async (req) => {
    const {id} = req.params;
    
    let params = {
        TableName: process.env.TABLE_NAME,
        Key:{
            "partitionKey": "itemPK",
            "sortKey": id,
        }
    };

    docClient.get = util.promisify(docClient.get);
    let item = await docClient.get(params);
    if(_.isEmpty(item.Item)) {
        throw ({status: 400, message: constant.ITEM_NOT_EXIST})
    }
    const favorited = await checksingleFavorProduct(req.user.Items[0].sortKey, id);
    
    if(!_.isEmpty(favorited.Items)) {
        item.Item.turnOnLiked = 1
    }
    
    return item;

}



module.exports.favorite = async (req) => {
    const {itemId} = req.body;

    const favorited = await checksingleFavorProduct(req.user.Items[0].sortKey, itemId);

    if(_.isEmpty(favorited.Items)) {
        let params = {
            TableName: process.env.TABLE_NAME,
            Item:{
                "partitionKey": req.user.Items[0].sortKey,
                "sortKey": itemId,
            }
        };

        let upParams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "partitionKey": "itemPK",
                "sortKey": itemId
            },
            UpdateExpression: "set liked = liked + :y",
            ExpressionAttributeValues: {
                ":y": 1
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update = util.promisify(docClient.update);
        const result =  await docClient.update(upParams);

        docClient.put = util.promisify(docClient.put);
        await docClient.put(params);
        return result;
    
    
    }
    else {
        throw ({status: 400, message: constant.ALREADY_ADDED})
    }
};

module.exports.disLiked = async (req) => {
    const {user} = req;
    const {itemId} = req.body;
    
    const favorited = await checksingleFavorProduct(req.user.Items[0].sortKey, itemId);

    if(!_.isEmpty(favorited.Items)) {
        let params = {
            TableName:process.env.TABLE_NAME,
            Key:{
                "partitionKey": user.Items[0].sortKey,
                "sortKey": req.body.itemId
            },
        };

        let downParams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "partitionKey": "itemPK",
                "sortKey": itemId
            },
            UpdateExpression: "set liked = liked - :y",
            ExpressionAttributeValues: {
                ":y": 1
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.delete = util.promisify(docClient.delete);
        docClient.update = util.promisify(docClient.update);
        const result =  await docClient.update(downParams);
        await docClient.delete(params);
        return result
    }
    else {
        throw ({status: 400, message:constant.ITEM_NOT_IN_LIST});
    }
};

module.exports.favorList = async (req) => {
    const list = await showfavorList(req);

    if (list.Count === 0) {
        // throw ({status: 400, message: "FAVORITE_LIST_IS_EMPTY"});
        return list;
    }

    const array = [];
    for(let i = 0; i < list.Items.length; i++) {
        array.push(list.Items[i].sortKey);
    }
    const Objects = {};
    let index = 0;
    array.forEach(function(value) {
        index++;
        let key = ":titlevalue"+index;
        Objects[key.toString()] = value;
    });
    let params = {
        TableName : process.env.TABLE_NAME,
        FilterExpression : " #id = :partitionKey and sortKey IN ("+Object.keys(Objects).toString()+ ")",
        ExpressionAttributeNames: {
            "#id": "partitionKey",
        },
        ExpressionAttributeValues : Object.assign( { ':partitionKey': "itemPK" }, Objects )
    };

    docClient.scan = util.promisify(docClient.scan);
    const result = await docClient.scan(params);

    return result;

};  

module.exports.getCategories = async (req) => {
    const {category, limit, ExclusiveStartKey} = req.body;

    const list = await getSingleCategory(category, limit, ExclusiveStartKey);

    if (list.Count === 0) {
        throw ({status: 400, message: constant.CATEGORY_NOT_FOUND});
    }

    const array = [];
    for(let i = 0; i < list.Items.length; i++) {
        array.push(list.Items[i].sortKey);
    }
    const Objects = {};
    let index = 0;
    array.forEach(function(value) {
        index++;
        let key = ":titlevalue"+index;
        Objects[key.toString()] = value;
    });

    let params = {
        TableName : process.env.TABLE_NAME,
        FilterExpression : " #id = :partitionKey and sortKey IN ("+Object.keys(Objects).toString()+ ")",
        ExpressionAttributeNames: {
            "#id": "partitionKey",
        },
        ExpressionAttributeValues : Object.assign( { ':partitionKey': "itemPK" }, Objects )
    };

    docClient.scan = util.promisify(docClient.scan);
    const result = await docClient.scan(params);

    const favorList = await showfavorList(req);
  
    for(let i = 0; i < favorList.Items.length; i++) {
        for(let j = 0; j < result.Items.length; j++) {
            if(favorList.Items[i].sortKey === result.Items[j].sortKey) {
                result.Items[j].turnOnLiked = 1;
            }
        }
    }

    return {result: result, LastEvaluatedKey: list.LastEvaluatedKey};
};


module.exports.searchProduct = async (req) => {
    let {title} = req.query
    title = title.toLowerCase();

    let params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#id = :partitionKey",
        FilterExpression: "contains(title, :title)",
        ExpressionAttributeNames: {
            "#id": "partitionKey",
        },
        ExpressionAttributeValues: {
            ":partitionKey": "itemPK",
            ":title": title
        }
    };

    docClient.query = util.promisify(docClient.query);
    const result = await docClient.query(params);

    if(result.Items.length === 0) {
        throw ({status: 400, message: "NO_ITEM"});
    }
    else {
        return result.Items;
    }
    
};

module.exports.showTopItem = async () => {

    let params = {
        TableName: process.env.TABLE_NAME,
        IndexName: "ItemLiked",
        KeyConditionExpression: "partitionKey = :partitionKey",
        ExpressionAttributeValues: {
            ":partitionKey": "itemPK"
        },
        Limit: 4,
        ScanIndexForward: false
    };

    docClient.query = util.promisify(docClient.query);
    const items = await docClient.query(params);
    return items;
}
