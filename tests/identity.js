// load identity file json

var fs = require('fs');
var uuid = require('node-uuid');

var identity_filename = 'identity.mester';

fs.readFile(identity_filename, { "encoding": "UTF-8" }, function(err, data) {
	if (err) {
		console.log('no identity file present, creating one');
		var new_uuid = uuid.v4();
		var new_username = 'cyle';
		var file_contents = JSON.stringify({"username":new_username,"uuid":new_uuid});
		fs.writeFile(identity_filename, file_contents, function (err) {
			if (err) { throw err };
			console.log('saved identity');
		});
	} else {
		//console.log(data);
		var identity = JSON.parse(data);
		console.log(identity);
	}
});