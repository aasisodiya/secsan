"use strict";
// Load the SDK for JavaScript
var AWS = require("aws-sdk");

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB.DocumentClient();

exports.getdata = async (event) => {
  var teamName = "siscorp-alpha";
  if (event.body != null && event.body.teamName != null) {
    teamName = event.body.teamName;
  }
  var params = {
    TableName: "SecretSanta",
    Key: {
      teamName: teamName,
    },
  };
  let datadb = await ddb.get(params).promise();
  console.log(datadb);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: params,
      },
      null,
      2
    ),
  };
};
