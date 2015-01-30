// Nodejs encryption with CTR
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'the quick rabbit jumps over the lazy dog';

function encrypt(text, passphrase) {
	var cipher = crypto.createCipher(algorithm, passphrase);
	var crypted = cipher.update(text,'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text, passphrase) {
	var decipher = crypto.createDecipher(algorithm, passphrase);
	var dec = decipher.update(text,'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

var message = "A very long sentence about probably nothing, but maybe something crazy and what the fuck. Haha.";
console.log("message: " + message);
var hw = encrypt(message, password);
console.log("encrypted: " + hw);
console.log("decrypted: " + decrypt(hw, password));
