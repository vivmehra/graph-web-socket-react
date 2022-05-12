const io =  require('socket.io')(9013,{
    cors:{
        origin:['http://localhost:3000']
    }
});

const AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-southeast-2',
    accessKeyId: 'ASIA3QJSN5CWSZGX336V',
    secretAccessKey: 'Y8Bg+UphWY5MR4ndH/4We/C5ekrcpbZ3b0vVQHV2',
    sessionToken:
      'IQoJb3JpZ2luX2VjED4aDmFwLXNvdXRoZWFzdC0yIkYwRAIgZSRycGlG619o4pjmXiWqKcppmnxRUkBYtAmkMKocx4MCIFgSVRmBcAgu5BHV5eYvh+b9IS47OBZCkbCi5bmjJsr/KpoDCBcQAhoMNzkwOTE2NjIyNTA5IgwwaWzCfEMxKfnREEEq9wK6yxnXxpagvl7224gE6MvO9+GmjhorSjxpuDS85uzCb8BoSRqAeBrAtZRCdYcmUiF/VXb9jrl0XxWDV9OUPrzLxs3qL+MRpJ7QdTrVK6pBaMN9JTdwKg7TqS6zaj6mzJK550MSe06ZG9cjxFndZq4sCM1MBLGT3cp29CakB+dIp+dLjq1r/9oUraIHzI65ViBQEX8oNSvRsed4aU+lztp1Ilz5rcgQsA22ewJhOqAb1ySj/X5ba5y1tnBJHiNNG6Os6vXLCmMvFrV740j/qJKWmEPzHix4RQO46L+Zq3ECPpK9+meRozaR1xfFM3Prbv4QIxyt8PREwQpK1vbY/6NegNsXf1ZxGTUk4+AtRLyKRDxtyFAU8rx7sM/wcurXFzdioMfOwQ7nSsrnNrzHQCWI+M7wVWzyhNu7eCyyPfRCesINdHDpbb2phwIz8dAlMRdk9ztI1XfsypS3S7pVAWsJezgCX3fdScYBFuFO2uAs+qkn9cUrgmAwzdjpkwY6pwENaVQ4/UOZ35wkX+Tzc0ZjaqdAAU1uS5S+4Idi9Npsqsu4jxS4O0Hpq/JWxk2ypgZoIIsX7lrnO9ebpLjt9cyHLtJ5CAMe4lnkp976aWx1eN90LYni+WlMzXh+yyHOsUz3sm1nmnoyTlJdD4UTzaoV2k55Yc1hL0jp0YQRFM/ADjF7Yduf6OZmDEM8JHcIVlxrNRW4gu4I2nPCrTbf5dIAMTop8Xbv/A==',
  });

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const docClient = new AWS.DynamoDB.DocumentClient();

const scanTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };

    const scanResults = [];
    let items;
    do{
        items =  await dynamodb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey !== "undefined");
    return scanResults;

};

const uptateItem= async (tableName) => {
    const params = {
        TableName: tableName,
        Key: {
            "memberId": "001"
        },
        UpdateExpression: "set Grocery = :x, Rent = :y, Entertainment = :z, Internet = :a, Maid = :b, Medicine = :c",
        ExpressionAttributeValues: {
            ":x": "111",
            ":y": "222",
            ":z": "333",
            ":a": "444",
            ":b": "555",
            ":c": "666"
        }
    };

    docClient.update(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
}
async function main() {
    // await putItemToTable('test-socket-io');
    const tableData = await scanTable('test-socket-io')
    // const updateData = await uptateItem('test-socket-io')
    // console.log('updateDataupdateData', updateData)
    const formattedData = {}
    for (const [key, value] of Object.entries(tableData[0])) {
        formattedData[`${key}`] = value.S
      }

    io.on('connection', socket=>{
        io.emit('updatedData', formattedData )
    })

    console.log(formattedData)
}
main();
