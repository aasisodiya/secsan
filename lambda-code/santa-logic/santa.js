"use strict";
// Load the SDK for JavaScript
var AWS = require("aws-sdk");

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB.DocumentClient();

exports.getdata = async (event) => {
  // Fetching the query data
  var teamName = "siscorp-alpha";
  if (event.body != null && event.body.teamName != null) {
    teamName = event.body.teamName;
  }

  // Fetching the data from database
  var params = {
    TableName: "SecretSanta",
    Key: {
      teamName: teamName,
    },
  };
  let datadb = await ddb.get(params).promise();
  console.log(datadb);
  console.log(
    "Number of players playing : " + Object.keys(datadb.Item.players).length
  );

  // Santa Logic - forming pairs
  var participants = Object.keys(datadb.Item.players);
  var shuffle = [...participants]; // need a separate copy for comparison after shuffle
  while (!pairsAreUnique(participants, shuffle)) {
    shuffleit(shuffle);
  }
  console.log(participants);
  console.log(shuffle);

  // Sending Notifications to respective players with their assigned targets
  for (let index = 0; index < participants.length; index++) {
    const name = datadb.Item.players[participants[index]];
    const message =
      "Hi " +
      name +
      ", your target is " +
      datadb.Item.players[shuffle[index]] +
      "! Happy Hunting! Kill Them All!";
    console.log(message);
    await sendEmail(participants[index], message);
    await publishData(participants[index], message);
  }

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

// Function to shuffle/mix an array elements
function shuffleit(array) {
  array.sort(() => Math.random() - 0.5);
}

// Function to check if any elements at nth position match between two arrays
function pairsAreUnique(participants, shuffledParticipants) {
  for (let index = 0; index < participants.length; index++) {
    if (shuffledParticipants[index] == participants[index]) {
      return false;
    }
  }
  return true;
}

// Function to send email to respective users
async function sendEmail(sendto, message) {
  var params = {
    Destination: {
      ToAddresses: [sendto],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: "Secret Santa " + new Date().getFullYear(),
      },
    },
    Source: "akash_sisodiya@siscorp.com",
  };
  try {
    console.log(params);
    // const data = await ses.sendEmail(params).promise();
    console.log("Email sent successfully!");
  } catch (err) {
    console.log("Error : ", err);
  }
}

async function publishData(topic, message) {
  console.log("Publishing the data --------------------------------");
  try {
    var iotdata = new AWS.IotData({
      endpoint: await getIoTEndpoint(),
    });
    var params = {
      topic: topic,
      payload: message,
      qos: "1",
    };
    await iotdata.publish(params).promise();
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred !");
  }
}

async function getIoTEndpoint() {
  var params = {
    endpointType: "iot:Data-ATS",
  };

  const iot = new AWS.Iot();
  const endpoint = await iot.describeEndpoint(params).promise();
  // console.log(endpoint);
  return endpoint.endpointAddress;
}
