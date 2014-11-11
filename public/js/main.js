var socket = io();

var redColumn = $(".column.red"),
    yellowColumn = $(".column.yellow"),
    greenColumn = $(".column.green");
    total = $(".total span");

var redSound = new Howl({urls: ['sounds/red.mp3']}),
    yellowSound = new Howl({urls: ['sounds/yellow.mp3']}),
    greenSound = new Howl({urls: ['sounds/green.mp3']});

var newSound = function(data) {
    switch (data) {
        case "red":
            redSound.stop();
            redSound.play();
            break;
        case "yellow":
            yellowSound.stop();
            yellowSound.play();
            break;
        case "green":
            greenSound.stop();
            greenSound.play();
            break;
    }
}

var recursiveCheck = function(voteColor) {
    setTimeout(function() {
        if(animationTime[voteColor] <= 0) $reference[voteColor].removeClass("active");
        else recursiveCheck(voteColor);
    }, 500);
}

var newVote = function(data) {
    redColumn.css("width", data.red.percentage + "%");
    redColumn.find("span").text(Math.round(data.red.percentage) + "%");

    yellowColumn.css("width", data.yellow.percentage + "%");
    yellowColumn.find("span").text(Math.round(data.yellow.percentage) + "%");

    greenColumn.css("width", data.green.percentage + "%");
    greenColumn.find("span").text(Math.round(data.green.percentage) + "%");

    total.text(data.red.votes + data.yellow.votes + data.green.votes);

    $(".column").each(function() {
        var columnEl = $(this).find("i");
        columnEl.css("width","auto")

        if($(this).width() < columnEl.width() + 20) $(this).find("a").addClass("no-space");
        else $(this).find("a").removeClass("no-space");

        columnEl.css("width","100%");
    });
}

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

$("#admin .graph").click(function(e) {
    e.preventDefault();

    $("#wrapper").toggleClass("hidden");
});

$("#admin .reset").click(function(e) {
    e.preventDefault();

    socket.emit("reset votes", true);
});

var animationTime = {
    "red" : 0,
    "yellow" : 0,
    "green" : 0
};
var $reference = {};
$(".column a").click(function(e) {
    e.preventDefault();

    var voteColor = $(this).parent().attr("data-color");
    animationTime[voteColor] += 500;
    $reference[voteColor] = $(this);

    setTimeout(function(){
        animationTime[voteColor] -= 500;
    }, 500);

    if(!$reference[voteColor].hasClass("active")) {
        $reference[voteColor].addClass("active");
        recursiveCheck(voteColor);
    } 

    // newSound(voteColor);

    socket.emit("new vote", voteColor);
});

socket.on('vote results', function(data) {
    newVote(data);
});