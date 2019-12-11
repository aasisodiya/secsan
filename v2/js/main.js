var playerList = [];
var secretSanta = [];
var secretName = [];
var tcost = 0;
var canDisplay = false;

console.log($(location).attr('href'));
console.log(window);

var teamName;
$(document).ready(function () {
    let params = (new URL(document.location)).searchParams;
    if (params.get("teamName") != null) {
        if (params.get("teamName").trim() != "") {
            $("#teamName").prop('disabled', true);
        }
        $('#player').show();
        $('#instructions').hide();
        teamName = params.get("teamName");
        $('#teamName').val(teamName);
        if (params.get("admin") != null && params.get("admin").trim() != "") {
            $("#play").show();
            console.log('Admin');
        }
    } else if (params.get("admin") != null && params.get("admin").trim() != "") {
        $("#cteam").show();
        console.log('Admin');
    }
});

function startGame(params) {
    console.log("Start Game!");
    $('#instructions').hide();
    $('#cteam').show();
}

function add() {
    var name, email, phonenumber, secret;
    teamName = $('#teamName').val().trim();
    name = $('#name').val().trim();
    email = $('#email').val().trim();
    phonenumber = $('#phonenumber').val().trim();
    secret = $('#secret').val().trim();
    console.log(teamName, name, email, phonenumber, secret);
    if (teamName == null || teamName == "") {
        $('#teamName').attr('placeholder', "Please Enter Team Name");
        return;
    }
    if (name == null || name == "") {
        $('#name').attr('placeholder', "Please Enter Name");
        return;
    }
    if (email == null || email == "") {
        $('#email').attr('placeholder', "Please Enter Email");
        return;
    }
    if (phonenumber == null || phonenumber == "") {
        $('#phonenumber').attr('placeholder', "Please Enter PhoneNumber");
        return;
    }
    if (secret == null || secret == "") {
        $('#secret').attr('placeholder', "Please Enter Password");
        return;
    }
    var playerdata = '{"teamName":"' + teamName + '","name": "' + name + '","email": "' + email + '","phonenumber": ' + phonenumber + ',"secret": "' + secret + '"}'
    console.log(playerdata);
    $.ajax({
        type: 'POST',
        url: 'https://tnf0erzp8b.execute-api.us-east-1.amazonaws.com/dev/player',
        data: playerdata,
        success: function (data) {
            $('#player').empty();
            $('#player').html(data + "<br> Now wait for Admin to initiate The Game!<hr> <br> Click below button when admin has initiated the game! <hr> <br> <button onclick='loadtarget()'>Get My Target</button>");
        },
        contentType: "application/json",
        dataType: 'json',
        error: function (data) {
            console.log(data.responseText.replace(/"/g, ''));
            alert(data.responseText.replace(/"/g, ''));
        }
    }).fail((data) => {
        console.log(data);
    });
}

function loadtarget() {
    $('#player').hide();
    $('#target').show()
}

function findtarget() {
    var tphonenumber, tsecret;
    tphonenumber = $('#tphonenumber').val().trim();
    tsecret = $('#tsecret').val().trim();
    console.log(tphonenumber, tsecret);
    if (tphonenumber == null || tphonenumber == "") {
        $('#tphonenumber').attr('placeholder', "Please Enter PhoneNumber");
        return;
    }
    if (tsecret == null || tsecret == "") {
        $('#tsecret').attr('placeholder', "Please Enter Password");
        return;
    }
    $.ajax({
        type: 'GET',
        url: 'https://tnf0erzp8b.execute-api.us-east-1.amazonaws.com/dev/target?phonenumber=' + tphonenumber + '&secret=' + tsecret,
        success: function (data) {
            $('#target').empty();
            $('#target').html(data);
        },
        dataType: 'json',
        error: function (data) {
            console.log(data.responseText.replace(/"/g, ''));
            alert(data.responseText.replace(/"/g, ''));
        }
    }).fail((data) => {
        console.log(data);
    });
}

function createURL() {
    console.log("test");
    teamName = $('#createteam').val().trim();
    if (teamName == null || teamName.trim() == "") {
        $('#createteam').attr('placeholder', "Please Enter Team Name");
        return;
    }
    console.log(document.location);
    var url = document.location.origin + document.location.pathname + "?teamName=" + teamName
    console.log(url);
    $('#cteam').empty();
    $('#cteam').html("Share below URL with all the players <br> <hr> <input id='shareurl' style='color:blue; font-family: lucida console; margin:10px 0px;' value='" + url + "'> <br> <button onclick='myFunction()'>Copy</button>");
}

function myFunction() {
    /* Get the text field */
    var copyText = document.getElementById("shareurl");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}


function play() {
    teamName = $('#teamName').val().trim();
    if (teamName == null || teamName == "") {
        $('#teamName').attr('placeholder', "Please Enter Password");
        return;
    }
    $.ajax({
        type: 'GET',
        url: 'https://tnf0erzp8b.execute-api.us-east-1.amazonaws.com/dev/shuffle?team=' + teamName,
        success: function (data) {
            $('#player').empty();
            $('#player').html(data);
        },
        dataType: 'json',
        error: function (data) {
            console.log(data.responseText.replace(/"/g, ''));
            alert(data.responseText.replace(/"/g, ''));
        }
    }).fail((data) => {
        console.log(data);
    });
}
