const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-2',
  accessKeyId: 'ASIA3QJSN5CWXM2L3XN4',
  secretAccessKey: 'QzFgPfAqIShcfZ/4Fj6N4DkSPKxyoBfJO53M0W/t',
  sessionToken:
    'IQoJb3JpZ2luX2VjEFUaDmFwLXNvdXRoZWFzdC0yIkgwRgIhAJDZovc82Eh48dHNn1IXWqqGlcXYxMLHvcPBIrEfTg9nAiEAhj1pr8FAkS6ulipEUNfr7HvsSP6PlkY7YpE2Qdcy+aEqmgMILhACGgw3OTA5MTY2MjI1MDkiDID0TA2u8PEhJQD4XCr3As8T7I/9kkWNevZ4dQKMI5EaRLUQbC/RTo84jq47gUaiH1onVBbc1st1O+dy7JCvC8nelVcd/Vg/MzJ+xYqeDkjJd3sU64IH4hxRWtVR8aytitf5wh3hV2ygTcp0UgrlvzY7FSle3YWLu7RWWSCTEUNy+/gnY4xm8tIUKxUD/9Ip7bHRm8pHwCdD+xQeEJNFGYmvCoil4kY8UgHYssdvigElDfwEjZ7AMlZ67dnvfChueIoyUh+AdkppxbpsVovjuRpF4yMjQ9gzI0ae2yB1/kFXeXz0ghHBWSdmdgUYpCM9bPC3wV/4O29fhVQPT0I0d6YgiZOSYWcQy0lSynk2FtNUAYHxyQKCVehaX1pNxOh2uyVkTnq7RH2m6D1N/Z5iU6Iyf2GDijOL3mvUPPpiUzfaMuFQbtGtfd09WlCAjqXPn3TJtzhD7wYkx/WPLtJbwu/JzBy1YsbDxn+5f26WZw7uUVlEPDUeiwgc98IFSYKfLaK/Fzhh0TCj5O6TBjqlAVDyOQRrNVRxb90OFAU+hzr5WJtiO9+DAuxlzfahqjfqS+ifopHItIQem/JFDzqr8x6w6xqUJ6yhna3pd2WDOB7FD1ye83Ua1tig0WlbN08sLPTvN2kaNWkkYp2jlKryJu2tQD4MzSncXT8JgXqH6yKyngbvORK4llSxKsyuTNBck9DhJBk//MZ8oX7NUDvVNtcnHm0x1U7/h5KN5J8XbpSI4UM2cg==',
});

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const docClient = new AWS.DynamoDB.DocumentClient();

exports.uptateItem = async (tableName) => {
  const params = {
    TableName: tableName,
    Key: {
      memberId: '001',
    },
    UpdateExpression: 'set Grocery = :x, Rent = :y, Entertainment = :z, Internet = :a, Maid = :b, Medicine = :c',
    ExpressionAttributeValues: {
      ':x': `${Math.trunc(Math.random()*4000)+1}`,
      ':y': `${Math.trunc(Math.random()*4000)+1}`,
      ':z': `${Math.trunc(Math.random()*4000)+1}`,
      ':a': `${Math.trunc(Math.random()*4000)+1}`,
      ':b': `${Math.trunc(Math.random()*4000)+1}`,
      ':c': `${Math.trunc(Math.random()*4000)+1}`,
    },
  };

  console.log('params', params)
  await docClient.update(params).promise();
};

exports.scanTable = async (tableName) => {
  const params = {
    TableName: tableName,
  };

  const scanResults = [];
  let items;
  do {
    items = await dynamodb.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');
  return scanResults;
};

exports.formatTableData = (tableData) => {
  const formattedData = {};
  for (const [key, value] of Object.entries(tableData[0])) {
    formattedData[`${key}`] = value.S;
  }
  return formattedData;
};
