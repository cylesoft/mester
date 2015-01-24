# MESTER

## wat?

mester/MESTER/Mester/mesh-twitter is a mesh network type of distributed Twitter/Slack type thing. Really, I'm not sure yet.

Basic functionality right now is a command line interface which creates a unique identity for you (per instance), then lets you chat over the network with anyone else running this.

It all works over UDP broadcast packets. It has no identity verification.

Future plans are to make a GUI version, have a distributed store of archived message information, and "relays" -- this currently only works within the local network you're on.

## install/usage

Requires node.js v0.10+, built using 0.10.35.

To install the necessary dependencies, run `npm install`.

To use, simply run `node mester.js` and follow the instructions. Use the prompt as directed.

Get other people to use it or you'll just be talking to yourself.

## notes/plans/to-dos/whatever

if identity.mester file is present, use that for identity info. otherwise, create new uuid and prompt for username.

is there a way to make identities unspoofable? welp.

CLI stuff:

- broadcast presence to local network on connect
- broadcast new messages
- listen for new messages
- listen for message archive requests

message database: username, uuid, message, signed message, expiry date

user database: username, uuid, public key

relay mode? for connecting local networks over the internet

broadcast heartbeat to everyone else? every 10 seconds?

peer to peer encryption for direct messages? or group shared secret to decrypt messages? right now everything is 100% in the clear.

shared secret: for group private chats, select a shared secret via some other means, use that to decrypt messages, send using PGP?

## identity problem

problem: how do you make a distributed system with no central authority that allows users to be unique and verified while all data is fully public and distributed?

public key digital signatures? store all identities with public keys? http://www.codealias.info/technotes/openssl_rsa_sign_and_verify_howto

so sign every message with user's private key, everyone needs to have everyone else's public keys, verify each message before accepting it, store and redistribute signed