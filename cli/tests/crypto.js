var crypto = require('crypto');
var fs = require('fs');

console.log('generating keys');
var keypair = require('keypair');
var pair = keypair({bits:2048});
console.log('public key: ' + pair.public);
console.log('private key: ' + pair.private);

var message = "Hello there!";
console.log('message is: "'+message+'"');

console.log('signing');
var sign = crypto.createSign('RSA-SHA256');
sign.update(message);
var signed = sign.sign(pair.private, 'base64');
console.log('signed!');
console.log(signed);

console.log('verifying');
var verifier = crypto.createVerify('RSA-SHA256');
verifier.update(message);
var verified = verifier.verify(pair.public, signed, 'base64');
console.log(verified);