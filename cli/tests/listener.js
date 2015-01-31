
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

var mester_port = 37777;

socket.bind(mester_port, '0.0.0.0', function() {
	socket.setBroadcast(true);
	console.log('listening on port ' + mester_port);
});

socket.on("message", function (data, rinfo) {
	console.log("Message received from `" + rinfo.address + "`: " + data.toString());
});