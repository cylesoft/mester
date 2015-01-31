var gui = require('nw.gui');

console.log(process.version);

onload = function() {
	gui.Window.get().show();
}