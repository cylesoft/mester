
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

var username = 'cyle';
var this_uuid = 'lollerskates';

var broadcast_address = '255.255.255.255';
var mester_port = 37777;

socket.bind(mester_port, '0.0.0.0', function() {
	socket.setBroadcast(true);
});

socket.on("message", function(data, rinfo) {
	//console.log("Message received from `" + rinfo.address + "` : ");
	var incoming_tweet = JSON.parse(data.toString());
	//console.log(incoming_tweet);
	console.log(''+incoming_tweet.un+' ('+incoming_tweet.uuid+'): '+incoming_tweet.msg);
	rl.prompt();
});

console.log('MESTER (mesh-twitter) VERSION 0.0.1');
console.log('  Type "quit" or "exit" to stop all this.');
rl.setPrompt('MESTER> ');
rl.prompt();

rl.on('line', function(line) {
	var new_message = line.trim();
	switch(new_message) {
		case 'help':
			console.log('Just type whatever and hit enter.');
			rl.prompt();
			break;
			case 'quit':
			case 'exit':
			rl.close();
			break;
			default:
			// send out your tweet in proper serialized form
			var new_tweet = JSON.stringify({"un":username,"uuid":this_uuid,"msg":new_message});
			socket.send(new Buffer(new_tweet), 0, new_tweet.length, mester_port, broadcast_address, function (err) {
				if (err) { console.log(err); }
				console.log("Message sent");
				rl.prompt();
			});
			break;
		}
	}).on('close', function() {
		console.log('Have a great day!');
		process.exit(0);
	});