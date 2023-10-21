var socket = io();
socket.on('addimage', function (data, image) {
    $('#conversation').append
     (
       $('<p>').append($('<b>').text(data + ': '), '<a class="chatLink" href="' + image + '">' + '<img src="' + image + '"/></a>')
     );
});
socket.on('otherformat', function (data, base64file) {
    $('#conversation').append
      (
        $('<p>').append($('<b>').text(data + ': '), '<a href="' + base64file + '">Attachment File</a>')
      );
});
$(document).ready(function () {
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    $('#datasend').on('click', sendMessage);
    $('#data').keypress(processEnterPress);

    $('#dropZone').on('dragover', function (event) {
    event.stopPropagation();
    event.preventDefault();
    });

    dropZone.addEventListener('drop', function (event) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;

    for (var i = 0, file; file = files[i]; i++) {
    if (file.type.match(/image.*/)) {
    var reader = new FileReader();
    reader.onload = function (event) {
    socket.emit('user image', event.target.result);
    };
    reader.readAsDataURL(file);
    $('#dropZone').val('');
    }
    else {
    var reader = new FileReader();
    reader.onload = function (event) {
    socket.emit('other file', event.target.result);
    };
    reader.readAsDataURL(file);
    $('#dropZone').val('');
     }
   }
 });
});
function addUser() {
    socket.emit('adduser', prompt("Enter your Name to Sign in"));
}

function processMessage(username, data) {
    $('#conversation').append($('<p>').append($('<b>').text(username + ': '), '<span>' + data + '</span>')
    );
}
function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
    $('#users').append('<div class="userActive">' + key + '</div>');
    });
}
function sendMessage() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
    $('#data').focus();
}

var exitButton = document.getElementById("exit-button");

exitButton.addEventListener("click", function() {
  window.location.href = "http://Close-chat";
});

function processEnterPress(event) {
    if (event.which == 13) {
    event.preventDefault();
    $(this).blur();
    $('#datasend').focus().click();
    }
}