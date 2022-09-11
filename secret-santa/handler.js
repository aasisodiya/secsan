"use strict";

// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require("aws-sdk");
var ses = new aws.SES();

exports.handler = async (event) => {
  console.log(event);
  var participants = event.body.participants;
  console.log("Total Number of Participants : " + participants.length);
  var shuffle = [...participants]; // need a seperate copy
  while (!pairsAreUnique(participants, shuffle)) {
    shuffleit(shuffle);
  }
  console.log(participants);
  console.log(shuffle);

  for (let index = 0; index < participants.length; index++) {
    const name = participants[index];
    const message =
      "Hi " +
      name +
      ", your target is " +
      shuffle[index] +
      "! Happy Hunting! Kill Them All!";
    console.log(message);
    await sendEmail(shuffle[index], "message");
  }
};

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
    // console.log(params);
    // const data = await ses.sendEmail(params).promise();
    console.log("Email sent successfully!");
  } catch (err) {
    console.log("Error : ", err);
  }
}

function shuffleit(array) {
  array.sort(() => Math.random() - 0.5);
}

function pairsAreUnique(participants, shuffledParticipants) {
  for (let index = 0; index < participants.length; index++) {
    if (shuffledParticipants[index] == participants[index]) {
      return false;
    }
  }
  return true;
}

// Test Data
// var test = {
//   "body": {
//     "participants": [
//       "Akash",
//       "Arihant",
//       "Ashwin",
//       "Dhananjay",
//       "Pallavi",
//       "Shiwangi",
//       "Ujwal"
//     ]
//   }
// }

// exports.handler(test);

// {
//   "teamName": "siscorp",
//   "players": ["Akash","Arihant","Ashwin","Dhananjay","Pallavi","Shiwangi","Ujwal"],
//   "playersemail" :  ["akash_sisodiya@siscorp.com","arihant_patawari@siscorp.com","ashwin_chafale@siscorp.com","dhananjay_hedaoo1@siscorp.com","pallavi_sinha@siscorp.com","shiwangi_pasari@siscorp.com","ujwal_thakre@siscorp.com"]
// }
