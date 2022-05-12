const AWS = require('aws-sdk');

AWS.config.update({
  region: ''
  accessKeyId: '',
  secretAccessKey: '',
  sessionToken:
    ''
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
