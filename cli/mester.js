/*

	MESTER mesh-twitter type thing
	
	by cyle gage of cylesoft, 2015

*/

var readline = require('readline');
var dgram = require('dgram');
var fs = require('fs');
var crypto = require('crypto');
var uuid = require('node-uuid');
var keypair = require('keypair');

var rl = readline.createInterface(process.stdin, process.stdout);
var socket = dgram.createSocket('udp4');
var identity_filename = 'identity.mester';

var users = {};
var this_username = 'nobody';
var this_uuid = '000';
var this_keypair = {};
var broadcast_address = '255.255.255.255';
var mester_port = 37777;

console.log('MESTER (mesh-twitter) VERSION 0.0.1');

function identity_step() {
	fs.readFile(identity_filename, { "encoding": "utf8" }, function(err, data) {
		if (err) {
			console.log('No identity file present, creating one for you!');
			rl.question('Your username? ', function(line) {
				console.log('Saving username, UUID, and generating public/private keypair.');
				console.log('This may take a few seconds...');
				this_username = line.trim();
				this_uuid = uuid.v4();
				this_keypair = keypair({bits:2048});
				var file_contents = JSON.stringify({ "username": this_username, "uuid": this_uuid, "public_key": this_keypair.public, "private_key": this_keypair.private });
				fs.writeFile(identity_filename, file_contents, { "encoding": "utf8" }, function (err) {
					if (err) { throw err };
					console.log('Saved identity and keypair, continuing.');
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
			this_keypair.public = identity.public_key;
			this_keypair.private = identity.private_key;
			console.log('Loaded identity `'+this_username+'` ('+this_uuid+') with public/private keypair.');
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
			// verify incoming message with signature
			// get the incoming UUID's public key
			var verifier = crypto.createVerify('RSA-SHA256');
			verifier.update(incoming_message.msg);
			var verified = verifier.verify(users[incoming_message.uuid].public_key, incoming_message.sig, 'base64');
			if (verified) {
				console.log(''+users[incoming_message.uuid].username+' ('+incoming_message.uuid+'): '+incoming_message.msg);
			} else {
				console.log('incoming message from "'+incoming_message.un+'" not verified!');
			}
		} else if (incoming_message.t == 'presence') {
			if (users[incoming_message.uuid] == undefined) {
				users[incoming_message.uuid] = { "username": incoming_message.un, "public_key": incoming_message.public_key };
			}
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
	var first_message = JSON.stringify({"t":"presence","un":this_username,"uuid":this_uuid,"public_key":this_keypair.public});
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
			var signer = crypto.createSign('RSA-SHA256');
			signer.update(new_message);
			var message_signature = signer.sign(this_keypair.private, 'base64');
			var message_object_serialized = JSON.stringify({ "t": "chat", "uuid": this_uuid, "msg": new_message, "sig": message_signature });
			socket.send(new Buffer(message_object_serialized), 0, message_object_serialized.length, mester_port, broadcast_address, function (err) {
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