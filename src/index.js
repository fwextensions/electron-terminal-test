const ipc = require("electron").ipcRenderer;
const FitAddon = require("xterm-addon-fit").FitAddon;

const term = new Terminal({
	fontFamily: "Cascadia Code"
});
const fitAddon = new FitAddon();
let resizeTimer;

term.loadAddon(fitAddon);
term.open(document.getElementById("terminal"));

ipc.on("terminal.incomingData", (event,	data) => term.write(data));

term.onData(e => ipc.send("terminal.keystroke", e));

fitAddon.fit();

window.addEventListener("resize", () => {
	clearTimeout(resizeTimer);
	setTimeout(() => fitAddon.fit(), 250);
});
