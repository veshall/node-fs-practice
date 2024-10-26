import fs from "node:fs/promises";
import path from "node:path";

(async () => {
	const CREATE_FILE = "create file";
	const DELETE_FILE = "delete file";
	const RENAME_FILE = "rename file";
	const ADD_T0_FILE = "add to file";

	const watcher = fs.watch("./command.txt");
	const commandFileHandler = await fs.open("./command.txt", "r");

	const createFile = async (path) => {
		try {
			const existingFileHandle = await fs.open(path, "r");
			console.log(`the file ${path} already exists!`);
			existingFileHandle.close();
		} catch (e) {
			const newFileHandler = await fs.open(path, "w");
			console.log("File created!");
			newFileHandler.close();
		}
	};

	const deleteFile = async (path) => {
		const IsfileExists = await fs.open(path, "w");
		if (IsfileExists) {
			await fs.rm(path);
			console.log(`file ${path} deleted!`);
		} else {
			console.log("Error deleting file!");
		}
		IsfileExists.close();
	};

	const renameFile = async (oldPath, newPath) => {
		await fs.rename(oldPath, newPath);
	};

	commandFileHandler.on("change", async () => {
		console.log(a);
		const size = (await commandFileHandler.stat()).size;
		const buff = Buffer.alloc(size);

		// const offset = 0;
		// const length = buff.byteLength;
		// const position = 0;

		// const content = await commandFileHandler.read(
		// 	buff,
		// 	offset,
		// 	length,
		// 	position
		// );
		const command = buff.toString("utf-8");

		if (command.includes(CREATE_FILE)) {
			const filePath = command.substring(CREATE_FILE.length + 1);
			createFile(filePath);
		}

		if (command.includes(DELETE_FILE)) {
			const filePath = command.substring(DELETE_FILE.length + 1);
			deleteFile(filePath);
		}

		if (command.includes(RENAME_FILE)) {
			const catcher = command.indexOf(" to ");
			const oldPath = command.substring(RENAME_FILE + 1, catcher);
			const newPath = command.substring(catcher + 4);

			renameFile(oldPath, newPath);
		}
	});

	for await (const event of watcher) {
		if (event.eventType === "change") {
			commandFileHandler.emit("change");
		}
	}
})();
