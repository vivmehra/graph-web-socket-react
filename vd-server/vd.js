var AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-2',
  accessKeyId: 'ASIA3QJSN5CWSLC7SG56',
  secretAccessKey: 'f5K/pIVwBu73kllsR2dAn9Lt4NWbmN6QPyPhMaMT',
  sessionToken:
    'IQoJb3JpZ2luX2VjEDsaDmFwLXNvdXRoZWFzdC0yIkcwRQIgcPYx67DCJm+IVze4WtHSDBlMzPMWzHe0eCdtpnFzOUoCIQCLF6BBRfas1kFjZcP8ZDTXpI5XhI9Gmit69ZinJIFrXCqaAwgUEAIaDDc5MDkxNjYyMjUwOSIMbepOaZ5Ka3Dmo4CWKvcCaPksJlzgmOu7vI//YP+DRjDg0XvZTBpA7HqL0sUou8XYLEN35jzxtYyCYFFgaricVJbU+w+YIQEWJo0uiop1yrvHRwskFf8EjsisePbo07QmWQzMoU5wJh+1upJ2jqzEbrYoAXwGIqexYU92Jkdxiywv1oUpcrGs0cy/M524tSRBpeQJKJ1lokMPwE1SzwQEh+2uMyDBVcxDwjrmjVep7NgTwiReflpYOM5372tjedUCF8t72wilotPRgwvMHVCsC/NQa+kXtd4i22T9d/ELyjFC4NF//IvD03r7NnVL1qd0OqbCIQ89hih54OZ7SdOx24AH9CJgR08Xjx9cgx5FSkq/Oluv95VkoPKpGqIeOQ6k+ZokPiguG6+H3FUOPMv/S5En94Xf07meVlr3wQjuKQfkRmcJg3XGomGI8wD/JQ2q57CeVc4O6rPwOr6gWUbPB9iCrumkUjy+lqIjwVI0/wqJXYlUOtqp+sodMuq9C+E923ibWSvBMKGQ6ZMGOqYBNOaBjOh51ssUF0dZ3Rmc3sRNjnRir8+SowHDN55ohT1HkJdOzrQwdN/yxrqW+tPeqVWTUaNAjSZyqCmQ9QIV3g31h5m3Cvnqp8b27G6s74QLeY9EsCdlujIuQg9BS61oF/dj4JZ9TxUb28zMpGoa5RuMLqSxAPu/d5U7+YzQOEch9PJky5kcshrdxySGL492Pr1RwVvuWKQ2EQKm5JaQZrb5lXPDvQ==',
});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const putItemToTable = async (tableName)=>{
    await dynamodb.putItem(
        {
            "TableName": "test-socket-io",
            "Item": {
                "categoryId":{"S": "001"},
                "Grocery": {"S": "12"},
                "Rent":{"S": "19"},
                "Entertainment":{"S": "3"},
                "Internet":{"S": "5"},
                "Maid":{"S": "2"},
                "Medicine":{"S": "3"}
            }
        }).promise();
}
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

async function main() {
    // await putItemToTable('test-socket-io');
    const tableData = await scanTable('test-socket-io')
    console.log(tableData)
}
// const putCuscalCsv = async (body, filename) => {
//   // const fileName = `outbound/cuscal/${filename}`;
//   const uploadParams = {
//     Bucket: 'tmp2-zeller-sftp-server-ap-southeast-2-s3-cuscal2',
//     Key: 'redshift/2021/07/07/20/staging-datalake-delivery-stream-3-2021-07-07-20-06-10-2ab32cc9-8d89-4b43-910a-2131c6d1bbb0.csv',
//     Body: body,
//   };
//   await S3.putObject(uploadParams).promise();
// };
main();
