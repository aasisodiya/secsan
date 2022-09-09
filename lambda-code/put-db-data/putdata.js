"use strict";
// Load the SDK for JavaScript
var AWS = require("aws-sdk");

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB.DocumentClient();

exports.getdata = async (event) => {
  var teamName = "siscorp-alpha";
  var player,
    players = {},
    playeremail;
  if (event.body != null && event.body.teamName != null) {
    teamName = event.body.teamName;
    player = event.body.player;
    playeremail = event.body.playeremail;
  }
  var params = {
    TableName: "SecretSanta",
    Key: {
      teamName: teamName,
    },
  };
  let datadb = await ddb.get(params).promise();
  console.log(datadb);

  if (
    datadb.Item != null &&
    datadb.Item.teamName != null &&
    datadb.Item.players != null
  ) {
    teamName = datadb.Item.teamName;
    players = datadb.Item.players;
  }
  players[playeremail.toLowerCase()] = player;

  params = {
    TableName: "SecretSanta",
    Item: {
      teamName: teamName,
      players: players,
    },
  };
  console.log(params);
  await ddb.put(params).promise();
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
