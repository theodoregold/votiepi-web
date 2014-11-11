var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var voteTotal = 0;
var voteData = {
	red: {
		votes: 0,
		percentage: 0
	},
	yellow: {
		votes: 0,
		percentage: 0
	},
	green: {
		votes: 0,
		percentage: 0
	}
};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendfile(__dirname + '/static/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	io.emit('vote results', voteData);

	socket.on('new vote', function(data) {
		console.log('new vote');
		voteTotal++;
		voteData[data].votes++;

		for(var key in voteData) {
			voteData[key].percentage = (voteData[key].votes / voteTotal) * 100;
		}

		io.emit('vote results', voteData);
	});
});

http.listen(4000, function(){
	console.log('listening on *:4000');
});