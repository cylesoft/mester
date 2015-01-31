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

## structured/actual to-do list

- GUI using nw.js + io.js ?
	- identity pane
	- user presence pane
	- channel list pane
	- messages pane
	- debug view (hidden by default)
	- settings panel (hidden by default)
- every message needs a UUID
- ability to flush local identity, start a new one
- ability to set default expiration times for local storage
- traffic types/messages
	- initial presence message: uuid of user, local time
	- public key response: uuid of user, username, public key, local time
	- chat message: uuid of message, uuid of sender, uuid of channel, message, message signature, local time
	- request for channel list: uuid of channel, channel name
	- request for history: digest of chat messages from X time, or from Y user uuid
- local storage of stuff, all can expire
	- identities/users: uuid of user, username, public key, expire time
	- messages: uuid of message, uuid of sender, message, message signature, expire time
	- channel list: uuid of channel, channel name, passphrase if available, expire time
	- messages and identities you're not following or subscribed to go away quicker
- relay mode
	- send messages being sent around the local network to other relay nodes

## unstructured notes/plans/to-dos/whatever

status feed like twitter? just another channel? following certain people?

avatars? really simple 256-color 8-bit type things, to save on disk space? 12kb 70x70 PNGs? saved in base64 for use as data URIs?

relay mode? for connecting local networks over the internet... let admin decide max relays? start with 10? network overlap: how to stop echo chambers of relays sending to relays on the same network. check IP?

peer to peer encryption for direct messages? or group shared secret to decrypt messages? right now everything is 100% in the clear.

leverage heartbeat by using last sent message's received time, instead of a dedicated heartbeat packet.

"private channel" with shared secret: for group private chats, select a shared secret via some other means, use that to decrypt messages, send using PGP? or whatever node-crypto provides? see: http://lollyrock.com/articles/nodejs-encryption/

## old unstructured notes

if identity.mester file is present, use that for identity info. otherwise, create new uuid and prompt for username.

is there a way to make identities unspoofable? welp.

CLI stuff:

- broadcast presence to local network on connect
- broadcast new messages
- listen for new messages
- listen for message archive requests

message database: username, uuid, message, signed message, expiry date

user database: username, uuid, public key

broadcast heartbeat to everyone else? every 10 seconds? no, too much traffic.

## identity problem

problem: how do you make a distributed system with no central authority that allows users to be unique and verified while all data is fully public and distributed?

public key digital signatures? store all identities with public keys? http://www.codealias.info/technotes/openssl_rsa_sign_and_verify_howto

so sign every message with user's private key, everyone needs to have everyone else's public keys, verify each message before accepting it, store and redistribute signed message