/*

	MESTER mesh-twitter type thing
	
	by cyle gage of cylesoft, 2015

*/

var readline = require('readline');
var dgram = require('dgram');
var fs = require('fs');
var uuid = require('node-uuid');

var rl = readline.createInterface(process.stdin, process.stdout);
var socket = dgram.createSocket('udp4');
var identity_filename = 'identity.mester';

var this_username = 'nobody';
var this_uuid = '000';
var broadcast_address = '255.255.255.255';
var mester_port = 37777;

console.log('MESTER (mesh-twitter) VERSION 0.0.1');

function identity_step() {
	fs.readFile(identity_filename, { "encoding": "utf8" }, function(err, data) {
		if (err) {
			console.log('No identity file present, creating one for you!');
			rl.question('Your username? ', function(line) {
				this_username = line.trim();
				this_uuid = uuid.v4();
				var file_contents = JSON.stringify({ "username": this_username, "uuid": this_uuid });
				fs.writeFile(identity_filename, file_contents, { "encoding": "utf8" }, function (err) {
					if (err) { throw err };
					console.log('Saved identity, continuing.');
					connection_step();
				});
			});
			rl.prompt();
		} else {
			//console.log(data);
			var identity = JSON.parse(data);
			//console.log(identity);
			this_username = identity.username;
			this_uuid = identity.uuid;
			console.log('Loaded identity `'+this_username+'` ('+this_uuid+')');
			connection_step();
		}
	});
}

function connection_step() {
	socket.on("message", function(data, rinfo) {
		//console.log("Message received from `" + rinfo.address + "` : ");
		var incoming_message = JSON.parse(data.toString());
		//console.log(incoming_tweet);
		if (incoming_message.t == 'chat') {
			console.log(''+incoming_message.un+' ('+incoming_message.uuid+'): '+incoming_message.msg);
		} else if (incoming_message.t == 'presence') {
			console.log(''+incoming_message.un+' ('+incoming_message.uuid+') is now online!');
		} else if (incoming_message.t == 'query') {
			// send back stuff
			
		} else {
			// ???
		}
		rl.prompt();
	});
	
	socket.bind(mester_port, '0.0.0.0', function() {
		socket.setBroadcast(true);
		chat_step();
	});
}

function chat_step() {
	
	// we're here!
	var first_message = JSON.stringify({"t":"presence","un":this_username,"uuid":this_uuid});
	socket.send(new Buffer(first_message), 0, first_message.length, mester_port, broadcast_address, function (err) {
		if (err) { console.log(err); }
	});
	
	// show some helpful info
	console.log('Type "quit" or "exit" to stop all this.');
	console.log('Type "help" for a reminder. Otherwise, type whatever!');
	
	// set up the prompt
	rl.setPrompt('MESTER> ');
	
	// what to do on input
	rl.on('line', function(line) {
		var new_message = line.trim();
		switch(new_message) {
			case 'help':
			console.log('Type "quit" or "exit" to stop all this.');
			console.log('Otherwise, just type whatever and hit enter.');
			rl.prompt();
			break;
			case 'quit':
			case 'exit':
			rl.close();
			break;
			default:
			// send out your message in proper serialized form
			var new_message = JSON.stringify({"t":"chat","un":this_username,"uuid":this_uuid,"msg":new_message});
			socket.send(new Buffer(new_message), 0, new_message.length, mester_port, broadcast_address, function (err) {
				if (err) { console.log(err); }
				console.log("Message sent!");
				rl.prompt();
			});
			break;
		}
	}).on('close', function() {
		console.log('Have a great day!');
		process.exit(0);
	});
	
	// listen for input
	rl.prompt();
}

identity_step();