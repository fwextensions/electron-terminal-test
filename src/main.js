const {app, BrowserWindow, ipcMain} = require("electron");
const pty = require("node-pty");
const os = require("os");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
let mainWindow;

function createWindow()
{
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 655,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on("closed", () => mainWindow = null);

	const ptyProcess = pty.spawn(shell, [], {
		name: "xterm",
			// these seem to set the max cols/rows for the terminal
		cols: 200,
		rows: 200,
		cwd: process.env.INIT_CWD,
		env: process.env
	});

	ptyProcess.on("data", data => {
		mainWindow.webContents.send("terminal.incomingData", data);
		console.log("Data sent");
	});

	ipcMain.on("terminal.keystroke", (event, key) => ptyProcess.write(key));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});